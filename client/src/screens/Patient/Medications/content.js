import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

export default function MedicationsContent(props) {
  const classes = useStyles();
  const { data } = props;

  return (
    <>
      {data.map((item) => (
        <Grid key={item.start_dt} container>
          <Grid item className={classes.block}>
            <Typography
              component="span"
              className={classes.text12}
              color="textPrimary"
            >
              {moment(item.start_dt).format("MMM D YYYY")}
            </Typography>
          </Grid>
          <Grid item className={classes.block}>
            <Typography
              component="span"
              className={classes.text12}
              color="textPrimary"
            >
              {item.descr}
            </Typography>
          </Grid>
          <Grid item className={classes.block}>
            <Typography
              component="span"
              className={classes.text12}
              color="textPrimary"
            >
              {item.name}
            </Typography>
          </Grid>
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
