import React from "react";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: 9,
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
  const { data } = props;
  const classes = useStyles();

  return (
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
            <StyledTableCell>Detail</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!!data && data.length
            ? data.map((row) => (
              <StyledTableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {row.lab_dt ? moment(row.lab_dt).format("MMM D YYYY") : ""}
                </TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.physician}</TableCell>
                <TableCell>{row.physician}</TableCell>
                <TableCell>{row.physician}</TableCell>
                <TableCell>{row.physician}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.count}</TableCell>
                <TableCell>{row.detail}</TableCell>
              </StyledTableRow>
            ))
            : (
              <StyledTableRow>
                <TableCell colSpan={10}>
                  <Typography align="center" variant="body1">
                    No Records Found...
                  </Typography>
                </TableCell>
              </StyledTableRow>
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TestsContent;
