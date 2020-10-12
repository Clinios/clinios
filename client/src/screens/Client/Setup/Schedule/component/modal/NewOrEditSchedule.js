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
  FormGroup,
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
    date_start: schedule.date_start,
    date_end: schedule.date_end,
    time_start: schedule.time_start,
    time_end: schedule.time_end,
    active: schedule.active,
    note: schedule.note ? schedule.note : ""
  };

  const handleCreateNewOrEditSchedule = () => {
    if (isNewSchedule) {
      ScheduleService.createNewSchedule(payload).then((res) => {
        setTimeout(() => {
          dispatch(setSuccess(res.data.message));
        }, 300);
      });
    } else {
      ScheduleService.updateSchedule(schedule.id, user.id, payload).then(
        (res) => {
          setTimeout(() => {
            dispatch(setSuccess(res.data.message));
          }, 300);
        }
      );
    }
    handleOnClose();
    setTimeout(() => {
      fetchScheduleSearch();
    }, 200);
  };

  const handleOnChange = (event) => {
    setSchedule({
      ...schedule,
      [event.target.name]: event.target.value.trim()
    });
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
          <div className={classes.root}>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={6} className={classes.gridMargin}>
                <TextField
                  fullWidth={true}
                  autoFocus
                  required
                  id="userId"
                  name="user_id"
                  select
                  label="User"
                  value={schedule.user_id}
                  onChange={handleOnChange}
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
                <TextField
                  fullWidth={true}
                  required
                  variant="outlined"
                  label="Date Start"
                  type="date"
                  size="small"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  name="date_start"
                  value={
                    schedule.date_start
                      ? moment(schedule.date_start).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={handleOnChange}
                  onKeyUp={handleKeyUp}
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={4} className={classes.gridMargin}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  label="Date End"
                  type="date"
                  size="small"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  name="date_end"
                  value={
                    schedule.date_end
                      ? moment(schedule.date_end).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={handleOnChange}
                  onKeyUp={handleKeyUp}
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={4} className={classes.gridMargin}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  label="Time Start"
                  type="time"
                  size="small"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  name="time_start"
                  value={schedule.time_start ? schedule.time_start : ""}
                  onChange={handleOnChange}
                  onKeyUp={handleKeyUp}
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={4} className={classes.gridMargin}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  label="Time End"
                  type="time"
                  size="small"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  name="time_end"
                  value={schedule.time_end ? schedule.time_end : ""}
                  onChange={handleOnChange}
                  onKeyUp={handleKeyUp}
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormGroup>
              <FormControlLabel
                control={
                  <GreenSwitch
                    checked={Boolean(schedule.active)}
                    size="small"
                    name="active"
                    onChange={(event) => {
                      setSchedule({
                        ...schedule,
                        [event.target.name]: !schedule.active
                      });
                    }}
                    onKeyUp={handleKeyUp}
                  />
                }
                label="Active / Inactive"
                className={classes.root}
              />
              <p className={classes.statusText}>
                <span style={{ fontWeight: "500" }}>Status:</span> {status}
              </p>
            </FormGroup>

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
                onChange={handleOnChange}
                onKeyUp={handleKeyUp}
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
