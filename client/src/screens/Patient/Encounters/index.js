import React, { useState, useEffect } from "react";

import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import Card from "../../../components/common/Card";
import PatientService from "../../../services/patient.service";
import {
  EncountersFormFields,
  EncountersCards,
} from "../../../static/encountersForm";
import { setError, setSuccess } from "../../../store/common/actions";
import { resetEncounter } from "../../../store/patient/actions";
import { encounterTypeToLetterConversion, encounterLetterToTypeConversion } from "../../../utils/helpers";

const Form = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, patientId, reloadData } = props;
  const [formFields, setFormFields] = useState({
    title: "",
    encounter_type: "",
    name: "",
    date: "",
    notes: "",
    treatment: "",
  });
  const encounter = useSelector(
    (state) => state.patient.selectedEncounter,
    shallowEqual,
  );

  useEffect(() => {
    if (encounter) {
      updateFields();
    }
    return () => !!encounter && dispatch(resetEncounter());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounter]);

  const updateFields = () => {
    formFields.title = encounter.title;
    formFields.encounter_type = encounterTypeToLetterConversion(encounter.encounter_type);
    formFields.name = encounter.name;
    formFields.date = moment(encounter.dt).format("YYYY-MM-DD");
    formFields.notes = encounter.notes;
    formFields.treatment = encounter.treatment;
    setFormFields({ ...formFields });
  };

  const handleInputChnage = (e) => {
    const { value, name } = e.target;
    setFormFields({
      ...formFields,
      [name]: value,
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (encounter) {
      const encounterId = encounter.id;
      const reqBody = {
        data: {
          dt: formFields.date,
          title: formFields.title,
          encounter_type: encounterLetterToTypeConversion(formFields.encounter_type),
          type_id: formFields.encounter_type,
          name: formFields.name,
          notes: formFields.notes,
          treatment: formFields.treatment,
        },
      };
      PatientService.updateEncounters(patientId, encounterId, reqBody)
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
    } else {
      const reqBody = {
        data: {
          dt: formFields.date,
          title: formFields.title,
          type_id: formFields.encounter_type,
          name: formFields.name,
          notes: formFields.notes,
          treatment: formFields.treatment,
        },
      };
      PatientService.createEncounter(patientId, reqBody)
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
    }
  };

  return (
    <>
      <Typography variant="h3" color="textSecondary">
        Encounters Form
      </Typography>
      <form onSubmit={onFormSubmit}>
        <Grid container>
          <Grid item md={8}>
            <Grid className={classes.inputRow}>
              {EncountersFormFields.map((item, index) => (
                <Grid
                  key={index}
                  container
                  alignItems="center"
                  className={classes.formInput}
                >
                  <Grid item lg={2}>
                    <label variant="h4" color="textSecondary">
                      {item.label}
                    </label>
                  </Grid>
                  <Grid item md={4}>
                    {item.baseType === "input" ? (
                      <TextField
                        variant="standard"
                        name={item.name}
                        id={item.id}
                        type={item.type}
                        value={formFields[item.name]}
                        fullWidth
                        onChange={(e) => handleInputChnage(e)}
                        required
                      />
                    ) : (
                      <TextField
                        select
                        placeholder={item.label}
                        id={item.id}
                        name={item.name}
                        value={formFields[item.name]}
                        fullWidth
                        onChange={(e) => handleInputChnage(e)}
                        required
                      >
                        {item.options.map((option, index) => (
                          <MenuItem key={index} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Grid>
                </Grid>
              ))}
              <Grid className={classes.formInput}>
                <Grid item lg={6}>
                  <Typography gutterBottom variant="h5" color="textPrimary">
                    Internal Notes (Not Visible to Patients)
                  </Typography>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    variant="outlined"
                    name="notes"
                    id="notes"
                    type="text"
                    fullWidth
                    value={formFields.notes}
                    onChange={(e) => handleInputChnage(e)}
                    multiline
                    rows={5}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid className={classes.formInput}>
              <Grid item lg={6}>
                <Typography gutterBottom variant="h5" color="textPrimary">
                  Treatment Plan (Not Visible to Patients)
                </Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  variant="outlined"
                  name="treatment"
                  id="treatment"
                  type="text"
                  fullWidth
                  value={formFields.treatment}
                  onChange={(e) => handleInputChnage(e)}
                  multiline
                  rows={5}
                  required
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} className={classes.cardsContainer}>
            {EncountersCards.map((item, index) => (
              <Card
                key={index}
                title={item.title}
                showActions={item.showActions}
                showSearch={item.showSearch}
                icon={item.icon}
                primaryButtonText={item.primaryButtonText}
                secondaryButtonText={item.secondaryButtonText}
                iconHandler={() => console.log(item.title)}
                hasMinHeight
              />
            ))}

            <Grid className={classes.formInput} container justify="space-between">
              <Button variant="outlined" type="submit">
                Save
              </Button>
              <Button variant="outlined" onClick={() => onClose()}>
                Exit
              </Button>
            </Grid>
            <Typography gutterBottom>
              Created
              {" "}
              {moment().format("MMM D YYYY")}
            </Typography>
            <Typography gutterBottom>
              Created By
              {" "}
              {!!encounter && encounter.name}
            </Typography>
          </Grid>
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
    margin: theme.spacing(2, 0),
  },
  cardsContainer: {
    padding: theme.spacing(0, 2),
  },
}));

export default Form;
