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
  withStyles,
} from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";
import React from "react";

const useStyles = makeStyles((theme) => ({
  gridMargin: {
    margin: "8px 0px",
  },
  noteMargin: {
    margin: "15px 0px",
  },
  title: {
    backgroundColor: theme.palette.primary.light,
    "& h2": {
      color: "#fff",
    },
  },
  content: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontSize: "18px",
  },
  formControl: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    color: theme.palette.text.secondary,
    "& .MuiSelect-select": {
      minWidth: 120,
    },
  },
  root: {
    paddingLeft: "5px",
    "& .MuiTypography-root": {
      marginLeft: "5px",
    },
  },
  formHelperText: {
    width: "220px",
    fontSize: "12px",
    paddingLeft: "10px",
  },
  statusText: {
    width: "220px",
    fontSize: "14px",
  },
  modalAction: {
    borderTop: `1px solid ${theme.palette.background.default}`,
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));
const GreenSwitch = withStyles({
  switchBase: {
    color: grey[300],
    "&$checked": {
      color: green[500],
    },
    "&$checked + $track": {
      backgroundColor: green[500],
    },
  },

  checked: {},
  track: {},
})(Switch);

const NewOrEditSchedule = ({ isNewSchedule, isOpen, handleOnClose }) => {
  const classes = useStyles();
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
                  id="outlined-select-currency"
                  select
                  label="User"
                  // value={labCompanyId}
                  // onChange={handleChangeOfLabCompanyId}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option aria-label="None" value="" />
                  {/* {lebCompanyList.map((lab) => (
                        <option key={lab.id} value={lab.id}>
                          {lab.name}
                        </option>
                      ))} */}
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
                  variant="outlined"
                  label="Date Start"
                  type="date"
                  size="small"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={4} className={classes.gridMargin}>
                <TextField
                  fullWidth={true}
                  variant="outlined"
                  label="Date End"
                  type="date"
                  size="small"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={4} className={classes.gridMargin}>
                <TextField
                  fullWidth={true}
                  variant="outlined"
                  label="Time Start"
                  type="time"
                  size="small"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <p className={classes.formHelperText}>
                The name shown in the Appointment
              </p>
            </FormControl>
            <FormControl component="div" className={classes.formControl}>
              <Grid item xs={12} md={4} className={classes.gridMargin}>
                <TextField
                  fullWidth={true}
                  variant="outlined"
                  label="Time End"
                  type="time"
                  size="small"
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                    // checked={Boolean(cpt_favorite)}
                    size="small"
                    name="switchBox"
                    // onChange={handleChangeFavorite}
                    // onKeyUp={handleKeyUp}
                  />
                }
                label="Active / Inactive"
                className={classes.root}
              />
              <p className={classes.statusText}>
                <span style={{ fontWeight: "500" }}>Status:</span> {"Crrent"}
              </p>
            </FormGroup>

            <FormControl component="div" className={classes.formControl}>
              <TextField
                className={classes.noteMargin}
                fullWidth={true}
                variant="outlined"
                multiline
                name="note"
                label="Notes"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  rows: 6,
                }}
                // value={cpt_notes}
                // onChange={handleChangeNotes}
                // onKeyUp={handleKeyUp}
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
              color: colors.orange[600],
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            // onClick={handleEditCptCode}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewOrEditSchedule;
