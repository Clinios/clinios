import React, { useState, useEffect } from "react";
import _ from "lodash";
import { TextField, Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PatientService from "./../../../../services/patient.service";
import { setError, setSuccess } from "./../../../../store/common/actions";
import { useDispatch } from "react-redux";

const Diagnoses = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose } = props;
  const [diagnosis, setDiagnosis] = useState([]);

  useEffect(() => {
    fetchDiagnosis("");
  }, []);

  const handleInputChnage = (e) => {
    const { value } = e.target;
    debouncedSearchDiagnosis(value);
  };

  const debouncedSearchDiagnosis = _.debounce((query) => {
    fetchDiagnosis(query);
  }, 1000);

  const fetchDiagnosis = (searchText) => {
    const reqBody = {
      data: {
        text: searchText,
      },
    };
    PatientService.searchDiagnosis(reqBody).then((res) => {
      setDiagnosis(res.data);
    });
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const reqBody = {
      data: {
        patient_id: 1,
      },
    };
    PatientService.createDiagnoses(reqBody)
      .then((response) => {
        dispatch(setSuccess(`${response.data.message}`));
        onClose();
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message[0].msg) ||
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
      <Grid className={classes.heading} container justify="space-between">
        <Typography variant="h3" color="textSecondary">
          Diagnose
        </Typography>
      </Grid>

      <Grid container spacing={1}>
        <Grid item lg={4}>
          <Grid className={`${classes.border} ${classes.height100}`}>
            <TextField
              label=""
              placeholder="Search..."
              name="search"
              fullWidth
              variant="outlined"
              onChange={(e) => handleInputChnage(e)}
              size="small"
              className={classes.heading}
            />
            {diagnosis.length
            ?
            diagnosis.map((item, index) => (
              <Grid key={index}>
                <Typography gutterBottom variant="body1">
                  Chronic Fatigue (Un-specified)
                </Typography>
              </Grid>
            ))
            :
            null
          }
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
