import React from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    // marginTop: "20px",
    // padding: "0 25px",
  },
  paper: {
    padding: "5px",
  },
  tableContainer: {
    minWidth: 650,
    marginTop: theme.spacing(2),
    maxWidth: "880px",
  },
  overFlowControl: {
    maxWidth: "130px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 13,
  },
}))(Tooltip);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey,
    color: theme.palette.grey,
    fontSize: "12px",
    fontWeight: 700,
  },
  body: {
    fontSize: 14,
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
    },
    "& td": {
      fontSize: 12,
    },
  },
}))(TableRow);

export default function PatientSearchResults(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Encounter</StyledTableCell>
              <StyledTableCell>Client ID</StyledTableCell>
              <StyledTableCell>Note</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.result.map((result, index) => (
              <StyledTableRow key={index}>
                <TableCell component="th" scope="row">
                  {moment(result.dt).format("lll")}
                </TableCell>
                {result.encounter_title.length > 40 ? (
                  <LightTooltip title={result.encounter_title}>
                    <TableCell className={classes.overFlowControl}>
                      {result.encounter_title}
                    </TableCell>
                  </LightTooltip>
                ) : (
                  <TableCell className={classes.overFlowControl}>
                    {result.encounter_title}
                  </TableCell>
                )}
                <TableCell>{result.client_id}</TableCell>
                {result.notes && result.notes.length > 40 ? (
                  <LightTooltip title={result.notes}>
                    <TableCell
                      align="center"
                      className={classes.overFlowControl}
                    >
                      {result.notes || "-"}
                    </TableCell>
                  </LightTooltip>
                ) : (
                  <TableCell align="center" className={classes.overFlowControl}>
                    {result.notes || "-"}
                  </TableCell>
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

PatientSearchResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      client_id: PropTypes.string.isRequired,
      dt: PropTypes.string.isRequired,
      Encounter: PropTypes.string.isRequired,
      notes: PropTypes.string,
    })
  ).isRequired,
};
