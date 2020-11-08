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

import PatientService from "../../../../services/patient.service";
import { setError, setSuccess } from "../../../../store/common/actions";
import SelectCustomStyles from "../../../../styles/SelectCustomStyles";


const Allergies = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, patientId, reloadData } = props;
  const [allergies, setAllergies] = useState([]);
  const [selectedAllergy, setSelectedAllergy] = useState(null);

  useEffect(() => {
    fetchAllergies("");
  }, []);

  const fetchAllergies = (searchText) => {
    const reqBody = {
      data: {
        text: searchText,
      },
    };
    PatientService.searchAllergies(reqBody).then((res) => {
      setAllergies(res.data);
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const reqBody = {
      data: {
        drug_id: selectedAllergy.id,
      },
    };
    PatientService.createAllergy(patientId, reqBody)
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
          Select Allergy
        </Typography>
        <Button variant="outlined" onClick={() => onClose()}>
          Cancel
        </Button>
      </Grid>
      <Grid item lg={4}>
        <Select
          value={selectedAllergy}
          options={allergies.length ? allergies : []}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          onChange={(value) => setSelectedAllergy(value)}
          styles={SelectCustomStyles}
          isClearable
        />

        <List component="ul">
          {allergies.map((allergy) => (
            <ListItem
              onClick={() => setSelectedAllergy(allergy)}
              key={allergy.id}
              disableGutters
              button
            >
              <ListItemText primary={allergy.name} />
            </ListItem>
          ))}
        </List>
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
}));

export default Allergies;
