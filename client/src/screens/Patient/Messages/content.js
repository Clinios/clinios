import React from "react";

import { Grid, Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";


export default function MessagesContent(props) {
  const classes = useStyles();
  const { data /* reloadData */ } = props;

  return (
    <>
      {data.map((item, index) => (
        <Grid key={item.id}>
          <Grid container spacing={1}>
            <Grid item md={item.user_to_from ? 3 : 4}>
              <Typography
                component="span"
                variant="body1"
                className={`${classes.text12} ${classes.label}`}
                color="textPrimary"
              >
                Date: &nbsp;
              </Typography>
              <Typography
                component="span"
                variant="body1"
                className={classes.text12}
                color="textPrimary"
              >
                {moment(item.created).format("MMM D YYYY")}
              </Typography>
            </Grid>
            {
              !!item.user_to_from && (
                <Grid item md={item.user_to_name ? 3 : 4}>
                  <Typography
                    component="span"
                    variant="body1"
                    className={`${classes.text12} ${classes.label}`}
                    color="textPrimary"
                  >
                    From: &nbsp;
                  </Typography>
                  <Typography
                    component="span"
                    variant="body1"
                    className={classes.text12}
                    color="textPrimary"
                  >
                    {item.user_to_from || ""}
                  </Typography>
                </Grid>
              )
            }
            {
              !!item.user_to_name && (
                <Grid item md={item.user_to_from ? 3 : 4}>
                  <Typography
                    component="span"
                    variant="body1"
                    className={`${classes.text12} ${classes.label}`}
                    color="textPrimary"
                  >
                    To: &nbsp;
                  </Typography>
                  <Typography
                    component="span"
                    variant="body1"
                    className={classes.text12}
                    color="textPrimary"
                  >
                    {item.user_to_name || ""}
                  </Typography>
                </Grid>
              )
            }
            <Grid item>
              <Typography
                component="span"
                variant="body1"
                className={`${classes.text12} ${classes.label}`}
                color="textPrimary"
              >
                Subject: &nbsp;
              </Typography>
              <Typography
                component="span"
                variant="body1"
                className={classes.text12}
                color="textPrimary"
              >
                {item.subject}
              </Typography>
            </Grid>
          </Grid>
          <Grid key={item.id}>
            <Typography
              variant="body1"
              className={classes.text12}
              color="textPrimary"
            >
              {item.message}
            </Typography>
          </Grid>
          {data.length !== index + 1 && <Divider className={classes.divider} />}
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
  label: {
    fontWeight: 500,
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));
