import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import usePatientContext from "../../../../hooks/usePatientContext";
import { useLocalStore } from "../../../../utils/helpers";

const useStyles = makeStyles(() => ({
  inputRow: {
    marginBottom: 0,
  },
  text12: {
    fontSize: 12,
    whiteSpace: "pre-line",
  },
}));

const AdminNotesContent = (props) => {
  const classes = useStyles();
  const { isEncounter } = props;
  const { state } = isEncounter ? useLocalStore() : usePatientContext();
  const { admin_note } = state.patientInfo.data;

  return (
    <Grid className={classes.inputRow}>
      <Typography
        variant="body1"
        className={classes.text12}
        color="textPrimary"
      >
        {admin_note}
      </Typography>
    </Grid>
  );
};

AdminNotesContent.defaultProps = {
  isEncounter: false,
};

AdminNotesContent.propTypes = {
  isEncounter: PropTypes.bool,
};

export default AdminNotesContent;
