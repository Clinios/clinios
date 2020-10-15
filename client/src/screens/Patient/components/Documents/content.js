import React, { useEffect, useState, useCallback } from "react";

import { Typography, Grid } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import { useDispatch } from "react-redux";

import PatientService from "./../../../../services/patient.service";
import { setError, setSuccess } from "./../../../../store/common/actions";

const useStyles = makeStyles((theme) => ({
  tab: {
    padding: "5px 10px 5px 0",
    fontSize: 12,
    cursor: "pointer"
  },
  tabSelected: {
    padding: "5px 10px 5px 0",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: "bold"
  },
  tableContainer: {
    marginTop: theme.spacing(1.5),
    minWidth: 650
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    border: "none",
    "& button": {
      fontSize: "12px"
    }
  },
  indicator: {
    backgroundColor : theme.palette.primary.main,
  }
}));

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.grey,
    color: theme.palette.grey,
    whiteSpace: "nowrap",
    fontSize: "12px",
    fontWeight: 700,
    padding: "6px 24px 6px 2px"
  },
  body: {
    fontSize: 12
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    fontSize: 14,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover
    },
    "& th": {
      fontSize: 12,
      whiteSpace: "nowrap",
      padding: "2px 16px 2px 2px"
    },
    "& td": {
      fontSize: 12,
      whiteSpace: "nowrap",
      padding: "2px 16px 2px 2px"
    }
  }
}))(TableRow);

const DocumentsContent = (props) => {
  const { data, reloadData, patientId } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData([...data])
  }, [data])


  const fetchDocuments = useCallback((selectedTab) => {
    let tab = "";
    if(selectedTab === 0) {
      tab = "Labs";
    } else if(selectedTab === 1) {
      tab = "Imaging";
    } else if(selectedTab === 2) {
      tab = "Uncategorized";
    } else if(selectedTab === 3) {
      tab = "Deleted";
    }
    PatientService.getDocuments(patientId, tab).then((res) => {
      setTableData(res.data);
    });
  }, [patientId])

  const onItemDelete = (selectedItem) => {
    const documentId = selectedItem.id || 1;
    const tab = "Labs";
    PatientService.deleteDocument(documentId, tab)
      .then((response) => {
        dispatch(setSuccess(`${response.data.message}`));
        reloadData();
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        let severity = "error";
        dispatch(
          setError({
            severity: severity,
            message: resMessage
          })
        );
      });
  };

  const handleChange = (newValue) => {
    if(newValue !== tabValue) {
      fetchDocuments(newValue);
    }
    setTabValue(newValue);
  };

  return (
    <>
      <Grid container>
        <Typography
          className={tabValue === 0 ? classes.tabSelected : classes.tab}
          onClick={() => handleChange(0)}
          component="span"
        >
          All Labs
        </Typography>
        <Typography
          className={tabValue === 1 ? classes.tabSelected : classes.tab}
          onClick={() => handleChange(1)}
          component="span"
        >
          Imaging
        </Typography>
        <Typography
          className={tabValue === 2 ? classes.tabSelected : classes.tab}
          onClick={() => handleChange(2)}
          component="span"
        >
          Uncategorized
        </Typography>
        <Typography
          className={tabValue === 3 ? classes.tabSelected : classes.tab}
          onClick={() => handleChange(3)}
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
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Lab Date</StyledTableCell>
              <StyledTableCell>Physician</StyledTableCell>
              <StyledTableCell align="center">Conventional Flag</StyledTableCell>
              <StyledTableCell>Functional Flag</StyledTableCell>
              <StyledTableCell>Notes</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length
              ?
              tableData.map((row, index) => (
                <StyledTableRow key={`${row.created}_${index}`}>
                  <TableCell component="th" scope="row">
                    {moment(row.created).format("MMM D YYYY")}
                  </TableCell>
                  <TableCell>{row.filename}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>
                    {row.lab_dt ? moment(row.lab_dt).format("MMM D YYYY") : ""}
                  </TableCell>
                  <TableCell>{row.physician}</TableCell>
                  <TableCell>{row.physician}</TableCell>
                  <TableCell>{row.physician}</TableCell>
                  <TableCell>{row.note}</TableCell>

                  <TableCell className={classes.actions}>
                    <DeleteIcon onClick={() => onItemDelete(row)} fontSize="small" />
                  </TableCell>
                </StyledTableRow>
              ))
              :
              <StyledTableRow>
                <TableCell colSpan={10}>
                  <Typography align="center" variant="h6">No Documents Found...</Typography>
                </TableCell>
              </StyledTableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DocumentsContent;
