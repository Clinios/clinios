import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import Tooltip from "../../../../components/common/CustomTooltip";

export default function DiagnosesContent(props) {
  const classes = useStyles();
  const { data } = props;

  return (
    <>
      {
        data.map((item) => (
          <Grid key={item.icd_id} container className={classes.inputRow}>
            <Typography component="span" className={`${classes.text12} ${classes.block}`} color="textPrimary">{moment(item.created).format("MMM D YYYY")}</Typography>
            <Typography component="span" className={`${classes.text12} ${classes.block}`} color="textPrimary">{item.icd_id}</Typography>
            {
              !!item.name && item.name.length > 40
                ? (
                  <Tooltip title={item.name}>
                    <Typography component="span" className={`${classes.text12} ${classes.fullWidth}`} color="textPrimary">{item.name}</Typography>
                  </Tooltip>
                )
                : <Typography component="span" className={`${classes.text12} ${classes.fullWidth}`} color="textPrimary">{item.name}</Typography>
            }
          </Grid>
        ))
      }
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  text12: {
    fontSize: 12,
  },
  inputRow: {
    marginBottom: theme.spacing(0.5),
    flexWrap: "nowrap",
  },
  block: {
    width: 90,
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
}));
