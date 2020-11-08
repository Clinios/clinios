import React, { useState, useEffect, useCallback } from "react";

import {
  Button,
  Grid,
  Typography,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import Select from "react-select";

import PatientService from "../../../services/patient.service";
import {
  BillSelectionFields,
  LabortoriesSelectionFields,
  FavoritesSelectionFields,
} from "../../../static/requisitionform";
import { setError, setSuccess } from "../../../store/common/actions";
import SelectCustomStyles from "../../../styles/SelectCustomStyles";

const Requisitions = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, patientId, reloadData } = props;
  const [billSelection, setBillSelection] = useState("physician");
  const [labsSelection, setLabsSelection] = useState("");
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState([]);

  const fetchTests = useCallback(() => {
    PatientService.getTests(patientId).then((res) => {
      setTests(res.data);
    });
  }, [patientId]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleBillSelection = (e) => {
    setBillSelection(e.target.value);
  };

  const handleLabortoriesSelection = (e) => {
    setLabsSelection(e.target.checked);
  };

  const onFormSubmit = () => {
    const reqBody = {
      data: {
        cpt_id: selectedTest.cpt_id,
        encounter_id: 1, // hard coded for the time being: discussion required
      },
    };
    PatientService.createRequisition(patientId, reqBody)
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
          Select Lab Test
        </Typography>
      </Grid>
      <Grid container spacing={1}>
        <Grid item lg={3}>
          <FormControl component="fieldset" className={classes.section}>
            <FormLabel component="legend">Bill To</FormLabel>
            <RadioGroup
              row
              value={billSelection}
              onChange={handleBillSelection}
              name="position"
              defaultValue="top"
            >
              {BillSelectionFields.map((item, index) => (
                <FormControlLabel
                  key={index}
                  value={item.value}
                  label={item.label}
                  control={<Radio color="primary" />}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Grid className={classes.section}>
            <Typography gutterBottom variant="h4" color="textSecondary">
              Recommended
            </Typography>
            {[...Array(3)].map((item, index) => (
              <Grid container alignItems="center" direction="row" key={index}>
                <Typography variant="body1">
                  Chronic Fatigue (Un-specified)&nbsp;&nbsp;
                </Typography>
                <Button>[Remove]</Button>
              </Grid>
            ))}
          </Grid>
          <Grid item lg={9} className={classes.border}>
            <Typography gutterBottom variant="h5" color="textPrimary">
              Labortories
            </Typography>
            {LabortoriesSelectionFields.map((item, index) => (
              <Grid key={index}>
                <FormControlLabel
                  value={item.vlaue}
                  label={item.label}
                  control={<Checkbox color="primary" />}
                  onChange={handleLabortoriesSelection}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item lg={3}>
          <Grid item lg={8} className={classes.heading}>
            <Select
              value={selectedTest}
              options={tests.length ? tests : []}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              onChange={(value) => setSelectedTest(value)}
              styles={SelectCustomStyles}
              isClearable
              isLoading={!tests.length}
            />
          </Grid>

          <List component="ul">
            {tests.map((medication) => (
              <ListItem
                onClick={() => setSelectedTest(medication)}
                key={medication.id}
                disableGutters
                button
              >
                <ListItemText primary={medication.name} />
              </ListItem>
            ))}
          </List>

        </Grid>
        <Grid item lg={6}>
          <Grid className={`${classes.border} ${classes.height100}`}>
            <Typography gutterBottom variant="h5" color="textPrimary">
              Favorites
            </Typography>
            <Grid container spacing={1}>
              <Grid item lg={4}>
                {FavoritesSelectionFields.map((item, index) => (
                  <Grid key={index}>
                    <FormControlLabel
                      value={item.vlaue}
                      label={item.label}
                      control={<Checkbox color="primary" />}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid item lg={4}>
                {FavoritesSelectionFields.map((item, index) => (
                  <Grid key={index}>
                    <FormControlLabel
                      value={item.vlaue}
                      label={item.label}
                      control={<Checkbox color="primary" />}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid item lg={4}>
                {FavoritesSelectionFields.map((item, index) => (
                  <Grid key={index}>
                    <FormControlLabel
                      value={item.vlaue}
                      label={item.label}
                      control={<Checkbox color="primary" />}
                    />
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
        <Grid>
          <Button
            variant="outlined"
            className={classes.mr2}
            onClick={() => onFormSubmit()}
          >
            Complete
          </Button>
          <Button variant="outlined" onClick={() => onFormSubmit()}>
            Complete and Fax
          </Button>
        </Grid>
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
  section: {
    marginBottom: theme.spacing(2),
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
    marginTop: theme.spacing(2),
  },
  mr2: {
    marginRight: theme.spacing(2),
  },
}));

export default Requisitions;
