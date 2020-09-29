import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography
} from "@material-ui/core";

export default function RequisitionsContent(props) {
  const classes = useStyles();
  const { data } = props;

  return (
    <>
      {
        data.map(item => (
          <Grid key={item.id} container>
            <Grid item className={classes.block}>
              <Typography component="span" className={classes.text12} color="textPrimary">{moment(item.created).format("MMM DD YYYY")}</Typography>
            </Grid>
            <Grid item className={classes.block}>
              <Typography component="span" className={classes.text12} color="textPrimary">{item.id}</Typography>
            </Grid>
          </Grid>
        ))
        }
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  text12: {
    fontSize: 12
  },
  block: {
    width: 90,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: theme.spacing(0, 0.5, 0, 0),
  }
}));
