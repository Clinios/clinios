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

  const createPatientHandoutHandler = (item) => {
    const reqBody = {
      data: {
        handout_id: item.id,
      },
    };
    PatientService.createPatientHandout(patientId, reqBody)
      .then((response) => {
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        reloadData();
        dispatch(toggleHandoutsDialog());
      });
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

      <Grid item lg={4} className={`${classes.root} ${classes.mb2}`}>
        <List component="ul">
          {allHandouts.map((handout) => (
            <ListItem
              onClick={() => createPatientHandoutHandler(handout)}
              key={handout.id}
              disableGutters
              button
            >
              <ListItemText primary={handout.filename} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </>
  );
};

HandoutsForm.propTypes = {
  reloadData: PropTypes.func.isRequired,
};

export default HandoutsForm;
