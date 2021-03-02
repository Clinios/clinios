import React, { useEffect, useMemo, useState } from "react";

import {
  TextField, Button, Grid, Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

import usePatientContext from "../../../hooks/usePatientContext";
import { toggleMessageDialog, resetSelectedMessage } from "../../../providers/Patient/actions";
import PatientService from "../../../services/patient.service";


const useStyles = makeStyles((theme) => ({
  inputRow: {
    margin: theme.spacing(3, 0),
  },
  formInput: {
    marginBottom: theme.spacing(4),
  },
  dateInput: {
    marginBottom: theme.spacing(2),
    display: "none", // Comment out by Ruhul as per #CLIN-18
  },
  actionContainer: {
    marginTop: theme.spacing(4),
  },
}));

const NewMessage = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { reloadData } = props;

  const { state, dispatch } = usePatientContext();
  const { patientId } = state;
  const { selectedMessage, messageType } = state.messages;

  const [formFields, setFormFields] = useState({
    subject: "",
    message: "",
  });

  const isReplyDialog = useMemo(() => {
    if (messageType && messageType.includes("Reply")) {
      return true;
    }
    return false;
  }, [messageType]);

  useEffect(() => {
    if (selectedMessage) { // message is selected
      if (!isReplyDialog) { // not reply message
        formFields.message = selectedMessage.message;
      }
      formFields.subject = selectedMessage.subject;
      setFormFields({ ...formFields });
    }
    return () => !!selectedMessage && dispatch(resetSelectedMessage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMessage]);

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const onMessageSend = (e) => {
    e.preventDefault();
    const reqBody = {
      data: {
        message: formFields.message,
        subject: formFields.subject,
        unread_notify_dt: moment().format("YYYY-MM-DD"),
      },
    };
    PatientService.createMessage(patientId, reqBody)
      .then((response) => {
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        reloadData();
        dispatch(toggleMessageDialog());
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

  return (
    <>
      <Typography variant="h3" color="textSecondary">
        {isReplyDialog ? "Reply To Message" : "Send a Secure Message"}
      </Typography>
      <form onSubmit={onMessageSend}>
        <Grid className={classes.inputRow}>
          <Grid className={classes.formInput} item md={4}>
            <TextField
              required
              variant="standard"
              name="subject"
              id="subject"
              label="Subject"
              type="text"
              fullWidth
              value={formFields.subject}
              onChange={(e) => handleInputChange(e)}
              InputProps={{
                readOnly: isReplyDialog,
              }}
            />
          </Grid>
          <Grid item lg={2}>
            <Typography gutterBottom variant="body1" color="textPrimary">
              Message
            </Typography>
          </Grid>
          <Grid className={classes.formInput} item md={12}>
            <TextField
              required
              variant="outlined"
              name="message"
              id="message"
              type="text"
              fullWidth
              value={formFields.message}
              onChange={(e) => handleInputChange(e)}
              multiline
              rows={5}
            />
          </Grid>
        </Grid>
        <Grid className={classes.dateInput}>
          <KeyboardDatePicker
            required
            margin="dense"
            id="date-picker-dialog"
            label="Notification Date"
            format="dd/MM/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
            minDate={currentDate}
          />
        </Grid>
        {
          !!selectedDate && (
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Notify me if not read by
              {" "}
              {moment(selectedDate).format("MMM DD, YYYY")}
            </Typography>
          )
        }

        <Grid
          className={classes.actionContainer}
          container
          justify="space-between"
        >
          <Button variant="outlined" type="submit">
            Send
          </Button>
          <Button variant="outlined" onClick={() => dispatch(toggleMessageDialog())}>
            Cancel
          </Button>
        </Grid>
      </form>
    </>
  );
};

NewMessage.propTypes = {
  reloadData: PropTypes.func.isRequired,
};

export default NewMessage;
