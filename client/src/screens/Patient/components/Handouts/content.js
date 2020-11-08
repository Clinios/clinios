import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import Tooltip from "../../../../components/common/CustomTooltip";

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(0.5),
    flexWrap: "nowrap",
  },
  block: {
    minWidth: 90,
    maxWidth: 120,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: theme.spacing(0, 0.5, 0, 0),
  },
  fullWidth: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: theme.spacing(0, 0.5, 0, 0),
  },
  text12: {
    fontSize: 12,
  },
}));

const HandoutsContent = (props) => {
  const { data /* reloadData */ } = props;
  const classes = useStyles();

  return (
    <>
      {
        data.map((item) => (
          <Grid onClick={() => alert(item.filename)} key={item.created} container className={classes.inputRow}>
            <Typography component="span" className={`${classes.text12} ${classes.block}`} color="textPrimary">{moment(item.created).format("MMM D YYYY")}</Typography>
            {
              !!item.filename && item.filename.length > 40
                ? (
                  <Tooltip title={item.filename}>
                    <Typography component="span" className={`${classes.text12} ${classes.fullWidth}`} color="textPrimary">{item.filename}</Typography>
                  </Tooltip>
                )
                : <Typography component="span" className={`${classes.text12} ${classes.fullWidth}`} color="textPrimary">{item.filename}</Typography>
            }
          </Grid>
        ))
      }
    </>
  );
};

export default HandoutsContent;
