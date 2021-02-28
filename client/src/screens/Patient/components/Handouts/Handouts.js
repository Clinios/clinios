import React, {
  useState, useCallback,
} from "react";

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
import { toggleHandoutsDialog } from "../../../../providers/Patient/actions";
import PatientService from "../../../../services/patient.service";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 200,
  },
  actionContainer: {
    marginTop: theme.spacing(4),
  },
  mb2: {
    marginBottom: theme.spacing(2),
  },
  ml2: {
    marginLeft: theme.spacing(2),
  },
}));

const HandoutsForm = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { reloadData } = props;
  const [searchText, setSearchText] = useState("");
  const [allHandouts, setAllHandouts] = useState([]);
  const [selectedHandout, setSelectedHandout] = useState(null);
  const { state, dispatch } = usePatientContext();
  const { patientId } = state;

  const fetchAllHandouts = useCallback((e) => {
    e.preventDefault();
    PatientService.getAllHandouts().then((res) => {
      setAllHandouts(res.data);
    });
  }, []);

  useDidMountEffect(() => {
    if (!searchText.length) {
      setAllHandouts([]);
    }
  }, [searchText]);

  const createPatientHandoutHandler = () => {
    if (selectedHandout) {
      const reqBody = {
        data: {
          handout_id: selectedHandout.id,
        },
      };
      PatientService.createPatientHandout(patientId, reqBody)
        .then((response) => {
          enqueueSnackbar(`${response.data.message}`, { variant: "success" });
          reloadData();
          dispatch(toggleHandoutsDialog());
        });
    } else {
      enqueueSnackbar("Handout selection is required", { variant: "error" });
    }
  };

  return (
    <>
      {/* Commented out David Feb 2021
      <Grid className={classes.mb2}>
        <Typography variant="h3" color="textSecondary" gutterBottom>
          Patient Handouts
        </Typography>
      </Grid>
      */}

      <Grid container alignItems="center">
        <form onSubmit={(e) => fetchAllHandouts(e, searchText)}>
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
          {allHandouts.map((handout) => (
            <ListItem
              onClick={() => {
                setSearchText(handout.filename);
                setSelectedHandout(handout);
              }}
              key={handout.id}
              selected={!!selectedHandout && selectedHandout.filename === handout.filename}
              disableGutters
              button
            >
              <ListItemText primary={handout.filename} />
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
          onClick={() => createPatientHandoutHandler()}
          type="submit"
        >
          Save
        </Button>
        <Button variant="outlined" onClick={() => dispatch(toggleHandoutsDialog())}>
          Cancel
        </Button>
      </Grid>
    </>
  );
};

HandoutsForm.propTypes = {
  reloadData: PropTypes.func.isRequired,
};

export default HandoutsForm;
