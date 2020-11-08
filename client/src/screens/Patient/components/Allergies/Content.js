import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

export default function AllergiesContent(props) {
  const classes = useStyles();
  const { data /* reloadData */ } = props;

  return (
    <>
      {data.map((item) => (
        <Grid key={item.drug_id} className={classes.inputRow}>
          <Typography className={classes.text12}>{item.name}</Typography>
        </Grid>
      ))}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(0.5),
  },
  text12: {
    fontSize: 12,
  },
}));
