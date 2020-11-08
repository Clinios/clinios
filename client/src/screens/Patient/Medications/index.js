import React, { useState, useEffect } from "react";

import {
  Button,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import Select from "react-select";


import PatientService from "../../../services/patient.service";
import { setError, setSuccess } from "../../../store/common/actions";
import SelectCustomStyles from "../../../styles/SelectCustomStyles";

const Medications = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, patientId } = props;
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState([]);

  useEffect(() => {
    fetchMedications("");
  }, []);

  const fetchMedications = (searchText) => {
    PatientService.searchDrugs(searchText).then((res) => {
      setMedications(res.data);
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const reqBody = {
      data: {
        drug_id: selectedMedication.id,
      },
    };
    PatientService.createMedication(patientId, reqBody)
      .then((response) => {
        dispatch(setSuccess(`${response.data.message}`));
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
      <Grid className={classes.heading}>
        <Typography variant="h3" color="textSecondary">
          Select Drug
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={4}>
          <Select
            value={selectedMedication}
            options={medications.length ? medications : []}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            onChange={(value) => setSelectedMedication(value)}
            styles={SelectCustomStyles}
            isClearable
          />

          <List component="ul">
            {medications.map((medication) => (
              <ListItem
                onClick={() => setSelectedMedication(medication)}
                key={medication.id}
                disableGutters
                button
              >
                <ListItemText primary={medication.name} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item md={4}>
          <Grid className={classes.header}>
            <Typography variant="h4" color="textSecondary" align="center">
              Recent
            </Typography>
          </Grid>
          {(!!medications && medications.length)
            ? medications.map((item, index) => (
              <Grid key={index}>
                <Typography gutterBottom variant="body1" align="center">
                  {item.name}
                </Typography>
              </Grid>
            ))
            : null}
        </Grid>
        <Grid item md={4}>
          <Grid className={classes.header}>
            <Typography variant="h4" color="textSecondary" align="center">
              Recommended
            </Typography>
          </Grid>
          {[...Array(5)].map((item, index) => (
            <Grid key={index}>
              <Typography gutterBottom variant="body1" align="center">
                Exythromycine 25mcg Tablets
              </Typography>
            </Grid>
          ))}
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
    marginBottom: theme.spacing(4),
  },
  inputHeading: {
    marginBottom: theme.spacing(1),
  },
  header: {
    minHeight: 38,
    marginBottom: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default Medications;
