import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export default function AdminNotesContent(props) {
  const classes = useStyles();
  const { data } = props;

  return (
    <Grid className={classes.inputRow}>
      <Typography
        variant="body1"
        className={classes.text12}
        color="textPrimary"
      >
        {data}
      </Typography>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: 0,
  },
  text12: {
    fontSize: 12,
    whiteSpace: "pre-line",
  },
}));
