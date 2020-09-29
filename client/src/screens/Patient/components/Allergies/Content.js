import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

export default function AllergiesContent(props) {
  const classes = useStyles();
  const { data, /* reloadData */ } = props;

  return (
    <>
      {data.map((item) => (
        <Grid
          key={item.drug_id}
          className={classes.inputRow}
        >
          <Grid component="span">{item.name}</Grid>
        </Grid>
      ))}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(1),
  },
}));
