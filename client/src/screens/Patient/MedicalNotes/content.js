import React from "react";

import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export default function MedicalNotesContent(props) {
  const classes = useStyles();
  const { data } = props;

  return (
    <Typography className={classes.text12} color="textPrimary">
      {data}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(1),
  },
  text12: {
    fontSize: 12,
    whiteSpace: "pre-line",
  },
}));
