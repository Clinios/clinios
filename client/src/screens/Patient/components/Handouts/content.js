import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography
} from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: 9,
  },
  tableContainer: {
    // minWidth: 650,
  },
  actions: {
    textAlign: "center",
    display: "flex",
    border: "none",
    "& button": {
      fontSize: "12px",
    },
  },
  block: {
    minWidth: 90,
    maxWidth: 120,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: theme.spacing(0, 0.5, 0, 0),
  }
}));

const HandoutsContent = (props) => {
  const { data, /* reloadData */ } = props;
  const classes = useStyles();

  return (
    <>
    {
      data.map(item => (
        <Grid onClick={() => alert(item.filename)} key={item.created} container className={classes.inputRow}>
          <Grid item className={classes.block}>
            <Typography component="span" className={classes.text12} color="textPrimary">{moment(item.created).format("MMM DD YYYY")}</Typography>
          </Grid>
          <Grid item className={classes.block}>
            <Typography component="span" className={classes.text12} color="textPrimary">{item.filename}</Typography>
          </Grid>
        </Grid>
      ))
    }
    </>
  );
};

export default HandoutsContent;

