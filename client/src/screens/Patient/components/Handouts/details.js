import React from "react";

import IconButton from "@material-ui/core/IconButton";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import { useDispatch } from "react-redux";

import PatientService from "../../../../services/patient.service";
import { setError, setSuccess } from "../../../../store/common/actions";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: 9,
  },
  tableContainer: {
    minWidth: 650,
  },
  actions: {
    textAlign: "center",
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
      height: "50px",
    },
  },
}))(TableRow);

const HandoutsDetails = (props) => {
  const { data, reloadData, patientId } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const deleteItemHandler = (selectedItem) => {
    const handoutId = selectedItem.handout_id;
    PatientService.deleteHandout(patientId, handoutId)
      .then((response) => {
        dispatch(setSuccess(`${response.data.message}`));
        reloadData();
      })
      .catch((error) => {
        const resMessage = (error.response
            && error.response.data
            && error.response.data.message)
          || error.message
          || error.toString();
        const severity = "error";
        dispatch(
          setError({
            severity,
            message: resMessage,
          }),
        );
      });
  };

  return (
    <TableContainer className={classes.tableContainer}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Created</StyledTableCell>
            <StyledTableCell>Created By</StyledTableCell>
            <StyledTableCell>File Name</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!!data && data.length
            ? data.map((row, index) => (
              <StyledTableRow key={`${row.created}_${index}`}>
                <TableCell component="th" scope="row">
                  {moment(row.created).format("MMM D YYYY")}
                </TableCell>
                <TableCell>{row.name || ""}</TableCell>
                <TableCell>{row.filename}</TableCell>

                <TableCell className={classes.actions}>
                  <IconButton
                    className={classes.button}
                    onClick={() => deleteItemHandler(row)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))
            : (
              <StyledTableRow>
                <TableCell colSpan={4}>
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

export default HandoutsDetails;
