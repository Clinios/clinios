import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PatientService from "../../../services/patient.service";
import { setError, setSuccess } from "../../../store/common/actions";
import { useDispatch } from "react-redux";

const MedicalNotes = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, reloadData } = props;
  const [oldMedicalNote, setOldMedicalNote] = useState("");
  const [medicalNote, setMedicalNote] = useState("");

  useEffect(() => {
    setOldMedicalNote(props.oldMedicalNote);
    setMedicalNote(props.oldMedicalNote);
  }, [props.oldMedicalNote]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    // TODO:: static for the time being - discussion required
    let noteId = 1;
    const reqBody = {
      data: {
        old_medical_note: oldMedicalNote,
        medical_note: medicalNote,
      },
    };
    PatientService.updateMedicalNotes(reqBody, noteId)
      .then((response) => {
        dispatch(setSuccess(`${response.data.message}`));
        reloadData();
        onClose();
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        let severity = "error";
        dispatch(
          setError({
            severity: severity,
            message: resMessage,
          })
        );
      });
  };

  return (
    <>
      <Typography variant="h3" color="textSecondary">
        Medical Notes Form
      </Typography>
      <form onSubmit={onFormSubmit}>
        <Grid
          className={classes.actionContainer}
          container
          justify="space-between"
        >
          <Grid item lg={2}>
            <Typography gutterBottom variant="body1" color="textPrimary">
              Notes
            </Typography>
          </Grid>
          <Grid className={classes.formInput} item md={12}>
            <TextField
              required
              value={medicalNote}
              variant="outlined"
              name="medicalNote"
              id="medicalNote"
              type="text"
              fullWidth
              onChange={(e) => setMedicalNote(e.target.value)}
              multiline={true}
              rows={5}
            />
          </Grid>
          <Button variant="outlined" type="submit">
            Save
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
  actionContainer: {
    marginTop: theme.spacing(4),
  },
}));

export default MedicalNotes;
