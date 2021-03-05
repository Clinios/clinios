import React, { useCallback, useEffect, useState } from "react";

import { Typography, Grid } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import RestoreIcon from "@material-ui/icons/RestorePage";
import clsx from "clsx";
import { chunk, orderBy } from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import Tooltip from "../../../../components/common/CustomTooltip";
import usePatientContext from "../../../../hooks/usePatientContext";
// import useAuth from "../../../../hooks/useAuth";
import PatientService from "../../../../services/patient.service";
import { calculateFunctionalPercentage } from "../../../../utils/FunctionalRange";
import Lab from "./Dialog/Lab";

const useStyles = makeStyles((theme) => ({
  h300: {
    minHeight: 300,
  },
  tab: {
    paddingBottom: 5,
    margin: "5px 10px 5px 0",
    fontSize: 12,
    cursor: "pointer",
  },
  tabSelected: {
    paddingBottom: 5,
    margin: "5px 10px 5px 0",
    fontSize: 12,
    cursor: "pointer",
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  tableContainer: {
    minWidth: 650,
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    border: "none",
    "& button": {
      fontSize: "12px",
    },
  },
  overFlowControl: {
    maxWidth: "130px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  icon: {
    cursor: "pointer",
  },
  noRecordsMessage: {
    lineHeight: "21px",
    fontSize: 12,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey,
    color: theme.palette.grey,
    whiteSpace: "nowrap",
    fontSize: "12px",
    fontWeight: 700,
    padding: "6px 24px 6px 2px",
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    cursor: "pointer",
    fontSize: 14,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "& th": {
      fontSize: 12,
      whiteSpace: "nowrap",
      padding: "2px 16px 2px 2px",
    },
    "& td": {
      fontSize: 12,
      whiteSpace: "nowrap",
      padding: "2px 16px 2px 2px",
    },
  },
}))(TableRow);

const DocumentsContent = (props) => {
  const { reloadData, actionsEnable, isDialog } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { state } = usePatientContext();
  const classes = useStyles();
  const [documentName, setDocumentName] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const { data } = state.documents;
  const { patientId } = state;
  const history = useHistory();
  // const { user } = useAuth();

  const fetchDocuments = useCallback((selectedTab) => {
    if (selectedTab === 0) { // (All)
      const allData = data.filter((x) => x.status !== "D");
      setTableData([...allData]);
    } else if (selectedTab === 1) { // (Labs)
      const labsData = data.filter((x) => x.type === "L" && x.status !== "D");
      setTableData([...labsData]);
    } else if (selectedTab === 2) { // (Imaging)
      const imagingData = data.filter((x) => x.type === "I" && x.status !== "D");
      setTableData([...imagingData]);
    } else if (selectedTab === 3) { // (Un-Categorized)
      const uncategorizedData = data.filter((x) => (x.type !== "L" && x.type !== "M"
        && x.type !== "I" && x.status !== "D"));
      setTableData([...uncategorizedData]);
    } else if (selectedTab === 4) { // (Declined/Deleted)
      const deletedData = data.filter((x) => x.status === "D");
      setTableData([...deletedData]);
    } else if (selectedTab === 5) { // (Misc)
      const miscData = data.filter((x) => (x.type === "M" && x.status !== "D"));
      setTableData([...miscData]);
    }
  }, [data]);

  useEffect(() => {
    fetchDocuments(tabValue);
  }, [data, tabValue, fetchDocuments]);

  const updateDocumentStatusHandler = (selectedItemId, status, e) => {
    e.stopPropagation();
    const reqBody = {
      data: {
        type: status,
      },
    };
    PatientService.updateDocument(patientId, selectedItemId, reqBody)
      .then((response) => {
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        reloadData();
      })
      .catch((error) => {
        const resMessage = (error.response
          && error.response.data
          && error.response.data.message)
          || error.message
          || error.toString();
        enqueueSnackbar(`${resMessage}`, { variant: "error" });
      });
  };

  const handleDocumentClick = (doc) => {
    setDocumentName(doc.filename);
    // setIsLabModalOpen(true);
    history.push(`/lab/${patientId}`, { // user.id as per documentation
      fromHome: false,
      documentName: doc.filename,
      documentId: doc.id,
    });
  };

  const handleChange = (newValue) => {
    if (newValue !== tabValue) {
      fetchDocuments(newValue);
    }
    setTabValue(newValue);
  };

  const calculateFlag = (itemRow) => {
    const testsString = !!itemRow.tests && itemRow.tests.split(",");
    const allTestsArray = chunk(testsString, 4);

    const trimmedValues = !!allTestsArray && allTestsArray.length && allTestsArray.map((test) => {
      const tests = test.map((elem, index) => {
        if (index === 0) {
          return elem.replace(/["]/g, ``);
        }
        return Number(elem.replace(/["]/g, ``));
      });
      return tests;
    });

    // value, rangeLow, rangeHigh

    let flagResults = [];
    if (!!trimmedValues && trimmedValues.length) {
      flagResults = trimmedValues.map((value) => {
        const testName = value[0];
        const resultValue = Number(value[1]);
        const rangeLow = Number(value[2]);
        const rangeHigh = Number(value[3]);
        const flag = calculateFunctionalPercentage(rangeLow, rangeHigh, resultValue);
        let percentValue = 0;
        if (resultValue < rangeLow) {
          percentValue = Math.abs(Number(((resultValue / rangeLow) * 100) - 100).toFixed(1));
        }
        if (resultValue > rangeHigh) {
          percentValue = Math.abs(Number(((resultValue / rangeHigh) * 100) - 100).toFixed(1));
        }
        return {
          testName,
          flag,
          percentValue,
        };
      });
    }

    flagResults = orderBy(flagResults, ["percentValue"], ["desc"]);

    let resString = "";
    flagResults.forEach((item) => {
      if (item.flag.length) {
        resString += `${item.testName} (${item.flag}), `;
      }
    });
    resString = resString.trim(); // removing last space
    resString = resString.slice(0, -1); // removing last comma
    return resString;
  };

  return (
    <Grid
      className={clsx({
        [classes.h300]: isDialog,
      })}
    >
      <Grid container>
        <Typography
          className={tabValue === 0 ? classes.tabSelected : classes.tab}
          onClick={() => handleChange(0)}
          component="span"
        >
          All
        </Typography>
        <Typography
          className={tabValue === 1 ? classes.tabSelected : classes.tab}
          onClick={() => handleChange(1)}
          component="span"
        >
          Labs
        </Typography>
        <Typography
          className={tabValue === 2 ? classes.tabSelected : classes.tab}
          onClick={() => handleChange(2)}
          component="span"
        >
          Imaging
        </Typography>
        <Typography
          className={tabValue === 5 ? classes.tabSelected : classes.tab}
          onClick={() => handleChange(5)}
          component="span"
        >
          Misc
        </Typography>
        <Typography
          className={tabValue === 3 ? classes.tabSelected : classes.tab}
          onClick={() => handleChange(3)}
          component="span"
        >
          Uncategorized
        </Typography>
        <Typography
          className={tabValue === 4 ? classes.tabSelected : classes.tab}
          onClick={() => handleChange(4)}
          component="span"
        >
          Deleted
        </Typography>
      </Grid>
      <TableContainer className={classes.tableContainer}>
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Created</StyledTableCell>
              <StyledTableCell>Filename</StyledTableCell>
              <StyledTableCell>Conventional Flag</StyledTableCell>
              <StyledTableCell>Functional Flag</StyledTableCell>
              <StyledTableCell>Notes</StyledTableCell>
              {
                actionsEnable && (
                  <StyledTableCell align="center">Delete</StyledTableCell>
                )
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length ? (
              tableData.map((row) => {
                const flagValue = calculateFlag(row);
                return (
                  <StyledTableRow
                    key={`${row.created}_${row.filename}`}
                    onClick={() => handleDocumentClick(row)}
                  >
                    <TableCell component="th" scope="row">
                      {moment(row.created).format("MMM D YYYY")}
                    </TableCell>
                    <TableCell>{row.filename}</TableCell>
                    {!!flagValue && flagValue.length > 23
                      ? (
                        <Tooltip title={flagValue}>
                          <TableCell
                            className={classes.overFlowControl}
                          >
                            {flagValue}
                          </TableCell>
                        </Tooltip>
                      )
                      : <TableCell>{flagValue}</TableCell>}
                    {!!flagValue && flagValue.length > 23
                      ? (
                        <Tooltip title={flagValue}>
                          <TableCell
                            className={classes.overFlowControl}
                          >
                            {flagValue}
                          </TableCell>
                        </Tooltip>
                      )
                      : <TableCell>{flagValue}</TableCell>}
                    {
                      !!row.note && row.note.length > 10
                        ? (
                          <Tooltip title={row.note}>
                            <TableCell
                              className={classes.overFlowControl}
                            >
                              {row.note}
                            </TableCell>
                          </Tooltip>
                        )
                        : <TableCell>{row.note}</TableCell>
                    }
                    {actionsEnable && (
                      <TableCell className={classes.actions}>
                        {row.status === "D"
                          ? (
                            <RestoreIcon
                              className={classes.icon}
                              onClick={(e) => updateDocumentStatusHandler(row.id, "A", e)}
                              fontSize="small"
                            />
                          )
                          : (
                            <DeleteIcon
                              className={classes.icon}
                              onClick={(e) => updateDocumentStatusHandler(row.id, "D", e)}
                              fontSize="small"
                            />
                          )}
                      </TableCell>
                    )}
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <TableCell align="center" colSpan={10}>
                  <Typography className={classes.noRecordsMessage} align="center" variant="body1">
                    No Records Found...
                  </Typography>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {isLabModalOpen
        && (
          <Lab
            open={isLabModalOpen}
            documentName={documentName}
            patientId={patientId}
            handleClose={() => setIsLabModalOpen(false)}
          />
        )}
    </Grid>
  );
};

DocumentsContent.propTypes = {
  reloadData: PropTypes.func.isRequired,
  actionsEnable: PropTypes.bool.isRequired,
  isDialog: PropTypes.bool.isRequired,
};

export default DocumentsContent;
