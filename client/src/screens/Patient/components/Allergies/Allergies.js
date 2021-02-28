import React, { useState } from "react";

import {
  Button,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

import useDidMountEffect from "../../../../hooks/useDidMountEffect";
import usePatientContext from "../../../../hooks/usePatientContext";
import { toggleAllergyDialog } from "../../../../providers/Patient/actions";
import PatientService from "../../../../services/patient.service";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 200,
  },
  inputRow: {
    margin: theme.spacing(3, 0),
  },
  mb2: {
    marginBottom: theme.spacing(2),
  },
  ml2: {
    marginLeft: theme.spacing(2),
  },
}));

const Allergies = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { state, dispatch } = usePatientContext();
  const { reloadData } = props;
  const [searchText, setSearchText] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [selectedAllergy, setSelectedAllergy] = useState(null);
  const { patientId } = state;

  const fetchAllergies = (e, text) => {
    e.preventDefault();
    const reqBody = {
      data: {
        text,
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
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        reloadData();
        dispatch(toggleAllergyDialog());
      });
  };

  useDidMountEffect(() => {
    if (!searchText.length) {
      setAllergies([]);
    }
  }, [searchText]);

  return (
    <>
      {/* Commented out David Feb 2021
      <Grid className={classes.mb2}>
        <Typography
          variant="h3"
          color="textSecondary"
        >
          Select Allergy
        </Typography>
      </Grid>
      */}
      <Grid container alignItems="center">
        <form onSubmit={(e) => fetchAllergies(e, searchText)}>
          <TextField
            autoFocus
            required
            size="small"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            variant="outlined"
            type="submit"
            className={classes.ml2}
          >
            Search
          </Button>
        </form>
      </Grid>
      <Grid item lg={4} className={classes.root}>
        <List component="ul">
          {allergies.map((allergy) => (
            <ListItem
              onClick={() => {
                setSearchText(allergy.name);
                setSelectedAllergy(allergy);
              }}
              key={allergy.id}
              selected={!!selectedAllergy && selectedAllergy.id === allergy.id}
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
        <Button
          variant="outlined"
          onClick={() => dispatch(toggleAllergyDialog())}
        >
          Cancel
        </Button>
      </Grid>
    </>
  );
};

Allergies.propTypes = {
  reloadData: PropTypes.func.isRequired,
};

export default Allergies;
