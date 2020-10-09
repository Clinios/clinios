import {
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";
import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    minWidth: 450,
    marginTop: theme.spacing(2),
  },
}));

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
      padding: "6px 16px",
      fontSize: 12,
      height: "50px",
    },
  },
}))(TableRow);

const ScheduleSearchResultTable = ({ handleOnEditClick}) => {
  const classes = useStyles();
  return (
    <div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Date Start</StyledTableCell>
              <StyledTableCell>Date End</StyledTableCell>
              <StyledTableCell>Time Start</StyledTableCell>
              <StyledTableCell>Time End</StyledTableCell>
              <StyledTableCell>Active</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Created</StyledTableCell>
              <StyledTableCell>Created By</StyledTableCell>
              <StyledTableCell>Updated</StyledTableCell>
              <StyledTableCell>Updated By</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <TableCell component="th" scope="row">
                hello
              </TableCell>
              <TableCell>hello</TableCell>
              <TableCell>Hello</TableCell>
              <TableCell>Hello</TableCell>
              <TableCell>Hello</TableCell>
              <TableCell>Hello</TableCell>
              <TableCell>Hello</TableCell>
              <TableCell>Hello</TableCell>
              <TableCell>Hello</TableCell>
              <TableCell>Hello</TableCell>
              <TableCell>Hello</TableCell>
              <TableCell style={{ minWidth: "120px" }}>
                <IconButton aria-label="edit" onClick={handleOnEditClick}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="edit">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ScheduleSearchResultTable;
