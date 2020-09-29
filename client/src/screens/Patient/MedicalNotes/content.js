import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

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
