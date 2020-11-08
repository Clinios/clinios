import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";


export default function BillingContent(props) {
  const classes = useStyles();
  const { data } = props;

  return (
    <>
      {data.map((item, index) => (
        <Grid key={`${item.dt}_${index}`} container className={classes.inputRow}>
          <Grid item className={classes.block}>
            <Typography
              component="span"
              className={classes.text12}
              color="textPrimary"
            >
              {moment(item.dt).format("MMM D YYYY")}
            </Typography>
          </Grid>
          <Grid item className={classes.block}>
            <Typography
              component="span"
              className={classes.text12}
              color="textPrimary"
            >
              $
              {item.amount}
            </Typography>
          </Grid>
          <Grid item className={classes.block}>
            <Typography
              component="span"
              className={classes.text12}
              color="textPrimary"
            >
              {item.tran_type}
            </Typography>
          </Grid>
          <Grid item className={classes.block}>
            <Typography
              component="span"
              className={classes.text12}
              color="textPrimary"
            >
              {item.encounter_title}
            </Typography>
          </Grid>
          {!!item.cpt_procedure && (
            <Grid item className={classes.block}>
              <Typography
                component="span"
                className={classes.text12}
                color="textPrimary"
              >
                {item.cpt_procedure}
              </Typography>
            </Grid>
          )}
        </Grid>
      ))}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  text12: {
    fontSize: 12,
  },
  block: {
    width: 90,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: theme.spacing(0, 0.5, 0, 0),
  },
}));
