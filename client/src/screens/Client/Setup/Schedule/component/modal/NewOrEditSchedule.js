import {
  Button,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
  TextField,
  withStyles
} from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setSuccess } from "./../../../../../../store/common/actions";
import ScheduleService from "../../../../../../services/schedule.service";
import Alert from "@material-ui/lab/Alert";
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  gridMargin: {
    margin: "8px 0px"
  },
  noteMargin: {
    margin: "15px 0px"
  },
  title: {
    backgroundColor: theme.palette.primary.light,
    "& h2": {
      color: "#fff"
    }
  },
  content: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontSize: "18px"
  },
  formControl: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    color: theme.palette.text.secondary,
    "& .MuiSelect-select": {
      minWidth: 120
    }
  },
  root: {
    paddingLeft: "5px",
    "& .MuiTypography-root": {
      marginLeft: "5px"
    }
  },
  formHelperText: {
    width: "220px",
    fontSize: "12px",
    paddingLeft: "10px"
  },
  statusText: {
    width: "220px",
    fontSize: "14px"
  },
  modalAction: {
    borderTop: `1px solid ${theme.palette.background.default}`,
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}));
const GreenSwitch = withStyles({
  switchBase: {
    color: grey[300],
    "&$checked": {
      color: green[500]
    },
    "&$checked + $track": {
      backgroundColor: green[500]
    }
  },

  checked: {},
  track: {}
})(Switch);

const NewOrEditSchedule = ({
  user,
  isNewSchedule,
  isOpen,
  handleOnClose,
  userId,
  userList,
  handleChangeOfUserId,
  fetchScheduleSearch,
  ...props
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [schedule, setSchedule] = useState([]);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const tempSchedule = {
      ...props.schedule
    };
    setSchedule(tempSchedule);
  }, [props.schedule]);

  useEffect(() => {
    if (moment(schedule.date_start) > moment()) {
      setStatus("Future");
    } else if (moment(schedule.date_end) < moment()) {
      setStatus("Past");
    } else {
      setStatus("Current");
    }
  }, [schedule]);

  const payload = {
    user_id: schedule.user_id,
    date_start: moment(schedule.date_start).format("YYYY-MM-DD"),
    date_end: moment(schedule.date_end).format("YYYY-MM-DD"),
    time_start: moment(schedule.time_start, "HH:mm:ss").format("HH:mm:ss"),
    time_end: moment(schedule.time_end, "HH:mm:ss").format("HH:mm:ss"),
    active: schedule.active,
    note: schedule.note ? schedule.note : ""
  };

  const handleCreateNewOrEditSchedule = () => {
    if (isNewSchedule) {
      ScheduleService.createNewSchedule(payload).then(
        (response) => {
          setTimeout(() => {
            dispatch(setSuccess(response.data.message));
          }, 300);
        },
        (error) => {
          setTimeout(() => {
            setErrors(error.response.error);
          }, 300);
        }
      );
    } else {
      ScheduleService.updateSchedule(user.id, schedule.id, payload).then(
        (response) => {
          setTimeout(() => {
            dispatch(setSuccess(response.data.message));
          }, 300);
        },
        (error) => {
          setTimeout(() => {
            setErrors(error.response.error);
          }, 300);
        }
      );
    }
    handleOnClose();
    setTimeout(() => {
      fetchScheduleSearch();
    }, 200);
  };

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      handleCreateNewOrEditSchedule();
    }
  };

  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth={true}
        open={isOpen}
        onClose={handleOnClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.title}>
          {isNewSchedule ? "New Schedule" : "Edit Schedule"}
        </DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText id="alert-dialog-description">
            {isNewSchedule
              ? "This page is used to Create new schedule entry"
              : "This page is used to Edit existing schedule entry"}
          </DialogContentText>
          {errors &&
            errors.map((error, index) => (
              <Alert severity="error" key={index}>
                {error.msg}
              </Alert>
            ))}
          <div className={classes.root}>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={6} className={classes.gridMargin}>
                <TextField
                  fullWidth={true}
                  autoFocus
                  required
                  id="user_id"
                  name="user_id"
                  select
                  label="User"
                  value={schedule.user_id}
                  onChange={(e) =>
                    setSchedule({ ...schedule, user_id: e.target.value })
                  }
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true
                  }}
                  SelectProps={{
                    native: true
                  }}
                >
                  {!schedule.user_name && (
                    <option aria-label="None" value=""></option>
                  )}
                  {userList.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstname + " " + user.lastname}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={4} className={classes.gridMargin}>
                <KeyboardDatePicker
                  required
                  clearable
                  autoOk
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                  format="yyyy/MM/dd"
                  inputVariant="outlined"
                  variant="outlined"
                  id="dateStart"
                  label="Date Start"
                  className={classes.textField}
                  size="small"
                  name="date_start"
                  value={schedule.date_start}
                  onChange={(date) =>
                    setSchedule({ ...schedule, date_start: date })
                  }
                  onKeyUp={handleKeyUp}
                  maxDate={schedule.date_end}
                  maxDateMessage="Date start should not be after date end"
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={4} className={classes.gridMargin}>
                <KeyboardDatePicker
                  required
                  clearable
                  autoOk
                  KeyboardButtonProps={{
                    "aria-label": "change date"
                  }}
                  format="yyyy/MM/dd"
                  inputVariant="outlined"
                  variant="outlined"
                  id="dateEnd"
                  label="Date End"
                  className={classes.textField}
                  size="small"
                  name="date_end"
                  value={schedule.date_end}
                  onChange={(date) =>
                    setSchedule({ ...schedule, date_end: date })
                  }
                  onKeyUp={handleKeyUp}
                  InputLabelProps={{
                    shrink: true
                  }}
                  minDate={schedule.date_start}
                  minDateMessage="Date end should not be before date start"
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={4} className={classes.gridMargin}>
                <KeyboardTimePicker
                  required
                  inputVariant="outlined"
                  KeyboardButtonProps={{
                    "aria-label": "change time"
                  }}
                  id="time_start"
                  name={`time_start`}
                  label="Time Start"
                  value={
                    schedule.time_start
                      ? moment(schedule.time_start, "HH:mm:ss").format(
                          "YYYY-MM-DDTHH:mm:ss"
                        )
                      : null
                  }
                  className={classes.textField}
                  onChange={(date) =>
                    setSchedule({ ...schedule, time_start: date })
                  }
                  size="small"
                  autoOk
                  mask="__:__ _M"
                  InputLabelProps={{
                    shrink: true
                  }}
                  maxDate={schedule.time_end}
                  maxDateMessage="Time start should not be after time end"
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={4} className={classes.gridMargin}>
                <KeyboardTimePicker
                  required
                  inputVariant="outlined"
                  KeyboardButtonProps={{
                    "aria-label": "change time"
                  }}
                  id="time_end"
                  name={`time_end`}
                  label="Time End"
                  value={
                    schedule.time_end
                      ? moment(schedule.time_end, "HH:mm:ss").format(
                          "YYYY-MM-DDTHH:mm:ss"
                        )
                      : null
                  }
                  className={classes.textField}
                  onChange={(date) =>
                    setSchedule({ ...schedule, time_end: date })
                  }
                  size="small"
                  autoOk
                  mask="__:__ _M"
                  InputLabelProps={{
                    shrink: true
                  }}
                  minDate={schedule.time_start}
                  minDateMessage="Date end should not be before date start"
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControlLabel
              control={
                <GreenSwitch
                  checked={Boolean(schedule.active)}
                  size="small"
                  name="active"
                  onChange={(e) =>
                    setSchedule({ ...schedule, active: e.target.checked })
                  }
                  onKeyUp={handleKeyUp}
                />
              }
              label="Active / Inactive"
              className={classes.root}
            />
            <p className={classes.statusText}>
              <span style={{ fontWeight: "500" }}>Status:</span> {status}
            </p>

            <FormControl component="div" className={classes.formControl}>
              <TextField
                className={classes.noteMargin}
                fullWidth
                required
                variant="outlined"
                multiline
                name="note"
                label="Notes"
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  rows: 6
                }}
                value={schedule.note}
                onChange={(e) =>
                  setSchedule({ ...schedule, note: e.target.value })
                }
                onKeyUp={handleKeyUp}
                error={
                  String(schedule.note).length === 0 ||
                  String(schedule.note).length > 1000
                }
                helperText={
                  (String(schedule.note).length === 0 &&
                    "Note can't be empty") ||
                  (String(schedule.note).length > 1000 &&
                    "Note can't be grater than 1000 Chars")
                }
              />
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions className={classes.modalAction}>
          <Button
            size="small"
            variant="outlined"
            onClick={handleOnClose}
            style={{
              borderColor: colors.orange[600],
              color: colors.orange[600]
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleCreateNewOrEditSchedule}
          >
            {isNewSchedule ? "Save" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewOrEditSchedule;
