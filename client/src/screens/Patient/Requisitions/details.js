import React, { useState, useCallback } from "react";

import IconButton from "@material-ui/core/IconButton";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

import Alert from "../../../components/Alert";
import usePatientContext from "../../../hooks/usePatientContext";
import PatientService from "../../../services/patient.service";
import { dateFormat } from "../../../utils/helpers";

const useStyles = makeStyles(() => ({
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

const RequisitionsDetails = (props) => {
  const { reloadData } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { state } = usePatientContext();
  const classes = useStyles();

  const { data } = state.requisitions;
  const { patientId } = state;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openDeleteDialog = (item) => {
    setSelectedItem(item);
    setShowDeleteDialog((prevstate) => !prevstate);
  };

  const closeDeleteDialog = () => {
    setSelectedItem(null);
    setShowDeleteDialog((prevstate) => !prevstate);
  };

  const deleteItemHandler = (item) => {
    const requisitionId = item.id;
    PatientService.deleteRequisitions(patientId, requisitionId)
      .then((response) => {
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        reloadData();
        closeDeleteDialog();
      });
  };

  const isDeleteIconDisabled = useCallback((requisition) => {
    let res = false;
    if (requisition.dt !== null || requisition.lab_completed_dt !== null
      || requisition.lab_sample_received_dt !== null || requisition.lab_order_received_dt !== null) {
      res = true;
    }
    return res;
  }, []);

  return (
    <>
      <Alert
        open={showDeleteDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this requisition?"
        applyButtonText="Delete"
        cancelButtonText="Cancel"
        applyForm={() => deleteItemHandler(selectedItem)}
        cancelForm={closeDeleteDialog}
      />
      <TableContainer className={classes.tableContainer}>
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Created</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Lab Name</StyledTableCell>
              <StyledTableCell>Patient Paid</StyledTableCell>
              <StyledTableCell>Sent To Patient</StyledTableCell>
              <StyledTableCell>Lab Receipt</StyledTableCell>
              <StyledTableCell>Completed</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!data
              && data.length
              ? data.map((item) => (
                <StyledTableRow key={`${item.created}_${item.id}`}>
                  <TableCell component="th" scope="item">
                    {dateFormat(item.created)}
                  </TableCell>
                  <TableCell>{item.marker_name}</TableCell>
                  <TableCell>{item.lab_name}</TableCell>
                  <TableCell>
                    {item.dt ? dateFormat(item.dt) : ""}
                  </TableCell>
                  <TableCell>
                    {item.lab_order_received_dt ? dateFormat(item.lab_order_received_dt) : ""}
                  </TableCell>
                  <TableCell>
                    {item.lab_sample_received_dt ? dateFormat(item.lab_sample_received_dt) : ""}
                  </TableCell>
                  <TableCell>
                    {item.lab_completed_dt ? dateFormat(item.lab_completed_dt) : ""}
                  </TableCell>
                  <TableCell className={classes.actions}>
                    <IconButton
                      className={classes.button}
                      onClick={() => openDeleteDialog(item)}
                      disabled={isDeleteIconDisabled(item)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))
              : (
                <StyledTableRow>
                  <TableCell colSpan={7}>
                    <Typography align="center" variant="body1">
                      No Records Found...
                    </Typography>
                  </TableCell>
                </StyledTableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

RequisitionsDetails.propTypes = {
  reloadData: PropTypes.func.isRequired,
};

export default RequisitionsDetails;
