import React, { useState } from "react";

import {
  TextField, Button, Grid, Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import { useDispatch } from "react-redux";

import PatientService from "../../../../services/patient.service";
import { setError, setSuccess } from "../../../../store/common/actions";

const NewMessage = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, reloadData, patientId } = props;

  const [formFields, setFormFields] = useState({
    subject: "",
    message: "",
  });
  const [selectedDate, setSelectedDate] = React.useState(null);
  const currentDate = new Date();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
        unread_notify_dt: moment(selectedDate).format("YYYY-MM-DD"),
      },
    };
    PatientService.createMessage(patientId, reqBody)
      .then((response) => {
        dispatch(setSuccess(`${response.data.message}`));
        reloadData();
        onClose();
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
    <>
      <Typography variant="h3" color="textSecondary">
        Send a Secure Message
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
              onChange={(e) => handleInputChange(e)}
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
          <Button variant="outlined" onClick={() => onClose()}>
            Cancel
          </Button>
        </Grid>
      </form>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  inputRow: {
    margin: theme.spacing(3, 0),
  },
  formInput: {
    marginBottom: theme.spacing(4),
  },
  dateInput: {
    marginBottom: theme.spacing(2),
  },
  actionContainer: {
    marginTop: theme.spacing(4),
  },
}));

export default NewMessage;
