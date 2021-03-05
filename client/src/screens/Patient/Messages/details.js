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
import EditIcon from "@material-ui/icons/Edit";
import ReplyIcon from "@material-ui/icons/Reply";
import moment from "moment";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

import Alert from "../../../components/Alert";
import useAuth from "../../../hooks/useAuth";
import usePatientContext from "../../../hooks/usePatientContext";
import { toggleMessageDialog, setSelectedMessage, setMessageType } from "../../../providers/Patient/actions";
import PatientService from "../../../services/patient.service";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(1),
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

const MessagesDetails = (props) => {
  const { reloadData } = props;
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const { user } = useAuth();
  const { state, dispatch } = usePatientContext();
  const { data } = state.messages;
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
    const messageId = item.id;
    PatientService.deleteMessages(patientId, messageId)
      .then((response) => {
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        closeDeleteDialog();
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

  const isDeletDisabled = useCallback((item) => {
    if (item && item.user_id_from === user.id) {
      return false;
    }
    return true;
  }, [user.id]);

  const isEditDisabled = useCallback((item) => {
    if (item && item.user_id_from === user.id) {
      return false;
    }
    return true;
  }, [user.id]);

  const isReplyDisabled = useCallback((item) => {
    if (item && item.user_id_from === null) {
      return false;
    }
    return true;
  }, []);

  return (
    <>
      <Alert
        open={showDeleteDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this message?"
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
              <StyledTableCell>Subject</StyledTableCell>
              <StyledTableCell>From</StyledTableCell>
              <StyledTableCell>To</StyledTableCell>
              <StyledTableCell>Message</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!data && data.length
              ? data.map((row) => (
                <StyledTableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {moment(row.created).format("MMM D YYYY")}
                  </TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>{row.user_to_from || "Patient"}</TableCell>
                  <TableCell>{row.user_to_name || "Patient"}</TableCell>
                  <TableCell>{row.message}</TableCell>
                  <TableCell className={classes.actions}>
                    <IconButton
                      disabled={isDeletDisabled(row)}
                      className={classes.button}
                      onClick={() => openDeleteDialog(row)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      disabled={isEditDisabled(row)}
                      className={classes.button}
                      onClick={() => {
                        dispatch(setMessageType("Edit"));
                        dispatch(setSelectedMessage(row));
                        dispatch(toggleMessageDialog());
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      disabled={isReplyDisabled(row)}
                      className={classes.button}
                      onClick={() => {
                        dispatch(setMessageType("Reply To"));
                        dispatch(setSelectedMessage(row));
                        dispatch(toggleMessageDialog());
                      }}
                    >
                      <ReplyIcon fontSize="small" />
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

MessagesDetails.propTypes = {
  reloadData: PropTypes.func.isRequired,
};

export default MessagesDetails;
