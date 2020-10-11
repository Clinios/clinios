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
import moment from "moment";

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

const ScheduleSearchResultTable = ({
  handleOnEditClick,
  searchResult,
  fetchScheduleSearch,
  handleDeleteSchedule,
}) => {
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
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResult.map((result) => (
              <StyledTableRow key={result.id}>
                <TableCell component="th" scope="row">
                  {result.user_name}
                </TableCell>
                <TableCell>
                  {result.date_start
                    ? moment(result.date_start).format("ll")
                    : ""}
                </TableCell>
                <TableCell>
                  {result.date_end ? moment(result.date_end).format("ll") : ""}
                </TableCell>
                <TableCell>
                  {result.time_start
                    ? moment(result.time_start, "hh:mm:a").format("LT")
                    : ""}
                </TableCell>
                <TableCell>
                  {result.time_end
                    ? moment(result.time_end, "hh:mm:a").format("LT")
                    : ""}
                </TableCell>
                <TableCell>{result.active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {moment(result.date_start) > moment()
                    ? "Future"
                    : moment(result.date_end) < moment()
                    ? "Past"
                    : "Current"}
                </TableCell>
                <TableCell>
                  {result.created ? moment(result.created).format("lll") : ""}
                </TableCell>
                <TableCell>{result.created_name}</TableCell>
                <TableCell>
                  {result.updated ? moment(result.updated).format("lll") : ""}
                </TableCell>
                <TableCell>{result.updated_name}</TableCell>
                <TableCell style={{ minWidth: "120px" }}>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleOnEditClick(result.id)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleDeleteSchedule(result.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ScheduleSearchResultTable;
