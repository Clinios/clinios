import React, { useState, useEffect } from "react";

import {
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import Select from "react-select";

import PatientService from "../../../../services/patient.service";
import { setError, setSuccess } from "../../../../store/common/actions";
import SelectCustomStyles from "../../../../styles/SelectCustomStyles";

const Diagnoses = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, patientId, reloadData } = props;
  const [diagnosis, setDiagnosis] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnoses] = useState([]);

  useEffect(() => {
    fetchDiagnosis("");
  }, []);

  const fetchDiagnosis = (searchText) => {
    PatientService.searchICD(searchText).then((res) => {
      setDiagnosis(res.data);
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const reqBody = {
      data: {
        icd_id: selectedDiagnosis.id,
      },
    };
    PatientService.createDiagnoses(patientId, reqBody)
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
      <Grid className={classes.heading} container justify="space-between">
        <Typography variant="h3" color="textSecondary">
          Diagnose
        </Typography>
      </Grid>

      <Grid container spacing={1}>
        <Grid item lg={4}>
          <Grid className={`${classes.border} ${classes.height100}`}>
            <Select
              value={selectedDiagnosis}
              options={diagnosis.length ? diagnosis : []}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              onChange={(value) => setSelectedDiagnoses(value)}
              styles={SelectCustomStyles}
              isClearable
            />

            <List component="ul">
              {diagnosis.map((diagnose) => (
                <ListItem
                  onClick={() => setSelectedDiagnoses(diagnose)}
                  key={diagnose.id}
                  disableGutters
                  button
                >
                  <ListItemText primary={diagnose.name} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        <Grid item lg={8}>
          <Grid className={classes.border}>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h4" color="textPrimary" gutterBottom>
                  Recent ICDs
                </Typography>
                {[...Array(5)].map((item, index) => (
                  <Grid key={index}>
                    <Typography gutterBottom variant="body1">
                      Chronic Fatigue (Un-specified)
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" color="textPrimary" gutterBottom>
                  Recommended ICDs
                </Typography>
                {[...Array(5)].map((item, index) => (
                  <Grid key={index}>
                    <Typography gutterBottom variant="body1">
                      Chronic Fatigue (Un-specified)
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        className={classes.actionContainer}
        container
        justify="space-between"
      >
        <Button
          variant="outlined"
          onClick={(e) => onFormSubmit(e)}
          type="submit"
        >
          Save
        </Button>
        <Button variant="outlined" onClick={() => onClose()}>
          Cancel
        </Button>
      </Grid>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  inputRow: {
    margin: theme.spacing(3, 0),
  },
  heading: {
    marginBottom: theme.spacing(2),
  },
  border: {
    border: "1px solid grey",
    padding: 10,
  },
  height100: {
    height: "100%",
  },
  actionContainer: {
    paddingTop: theme.spacing(2),
  },
}));

export default Diagnoses;
