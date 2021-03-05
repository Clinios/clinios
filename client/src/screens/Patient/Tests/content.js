import React from "react";

import { Grid } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import moment from "moment";
import PropTypes from "prop-types";

import usePatientContext from "../../../hooks/usePatientContext";
import { calculateFunctionalRange, calculateFunctionalPercentage } from "../../../utils/FunctionalRange";
import { calculateAge } from "../../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  h300: {
    minHeight: 300,
  },
  button: {
    padding: theme.spacing(1),
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
  noRecordsMessage: {
    lineHeight: "21px",
    fontSize: 12,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey,
    color: theme.palette.grey,
    fontSize: "12px",
    whiteSpace: "nowrap",
    fontWeight: 700,
    padding: "6px 24px 6px 2px",
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
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

const TestsContent = (props) => {
  const classes = useStyles();
  const { isDialog } = props;
  const { state } = usePatientContext();
  const { data } = state.tests;
  const { gender, dob } = state.patientInfo.data;
  const patientAge = Number(calculateAge(dob).split(" ")[0]);

  const hasValue = (value) => !((typeof value === "undefined") || (value === null));

  return (
    <Grid
      className={clsx({
        [classes.h300]: isDialog,
      })}
    >
      <TableContainer className={classes.tableContainer}>
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Test</StyledTableCell>
              <StyledTableCell>Last Date</StyledTableCell>
              <StyledTableCell>Last Result</StyledTableCell>
              <StyledTableCell>Conv Range</StyledTableCell>
              <StyledTableCell>Conv Flag</StyledTableCell>
              <StyledTableCell>Func Range</StyledTableCell>
              <StyledTableCell>Func Flag</StyledTableCell>
              <StyledTableCell>Units</StyledTableCell>
              <StyledTableCell>Count</StyledTableCell>
              <StyledTableCell>Graph</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!data && data.length
              ? data.map((row) => {
                const functionalRange = calculateFunctionalRange(row.cpt_id, gender, patientAge);
                return (
                  <StyledTableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {row.lab_dt ? moment(row.lab_dt).format("MMM D YYYY") : ""}
                    </TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell>
                      {hasValue(row.range_low) && hasValue(row.range_high) && (
                        `${row.range_low} - ${row.range_high}`
                      )}
                    </TableCell>
                    <TableCell>
                      {
                        hasValue(row.range_low)
                        && hasValue(row.range_high)
                        && hasValue(row.value) && (
                          `${calculateFunctionalPercentage(row.range_low, row.range_high, row.value)}`
                        )
                      }
                    </TableCell>
                    <TableCell>
                      {hasValue(functionalRange.low) && hasValue(functionalRange.high)
                        ? `${functionalRange.low} - ${functionalRange.high}`
                        : ""}
                    </TableCell>
                    <TableCell>
                      {
                        hasValue(functionalRange.low)
                        && hasValue(functionalRange.high) && (
                          `${calculateFunctionalPercentage(
                            functionalRange.low,
                            functionalRange.high,
                            row.value,
                          )
                          }`
                        )
                      }
                    </TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>{row.count}</TableCell>
                    <TableCell>{row.detail}</TableCell>
                  </StyledTableRow>
                );
              })
              : (
                <StyledTableRow>
                  <TableCell colSpan={10}>
                    <Typography className={classes.noRecordsMessage} align="center" variant="body1">
                      No Records Found...
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

TestsContent.propTypes = {
  isDialog: PropTypes.bool.isRequired,
};

export default TestsContent;
