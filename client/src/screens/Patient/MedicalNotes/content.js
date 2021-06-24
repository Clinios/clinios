import React from "react";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import usePatientContext from "../../../hooks/usePatientContext";
import { useLocalStore } from "../../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(1),
  },
  text12: {
    fontSize: 12,
    whiteSpace: "pre-line",
  },
}));

const MedicalNotesContent = (props) => {
  const classes = useStyles();
  const { isEncounter } = props;
  const { state } = isEncounter ? useLocalStore() : usePatientContext();
  const { medical_note } = state.patientInfo.data;

  return (
    <Typography className={classes.text12} color="textPrimary">
      {medical_note}
    </Typography>
  );
};

MedicalNotesContent.defaultProps = {
  isEncounter: false,
};

MedicalNotesContent.propTypes = {
  isEncounter: PropTypes.bool,
};

export default MedicalNotesContent;
