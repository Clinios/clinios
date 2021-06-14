import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { dateFormat, calculateDateDifference } from "../../../../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "600",
    marginBottom: theme.spacing(1.5),
  },
  ml2: {
    marginLeft: theme.spacing(2),
  },
}));

const currentDate = new Date();

const ToolTipContent = (props) => {
  const classes = useStyles();
  const { data } = props;
  const {
    marker_name, created, dt, completed_dt, lab_receipt_dt, sent_to_patient_dt,
  } = data;

  const createdDaysDiff = created && calculateDateDifference(new Date(created), currentDate);
  const paymentDaysDiff = dt && calculateDateDifference(new Date(dt), currentDate);
  const completedDaysDiff = completed_dt && calculateDateDifference(new Date(completed_dt), currentDate);
  const labReceiptDaysDiff = lab_receipt_dt && calculateDateDifference(new Date(lab_receipt_dt), currentDate);
  // eslint-disable-next-line max-len
  const sentToDaysDiff = sent_to_patient_dt && calculateDateDifference(new Date(sent_to_patient_dt), currentDate);
  const constText = "ago";

  return (
    <>
      <Typography className={classes.title}>
        {marker_name}
      </Typography>
      <Grid container>
        <Grid item xs>
          <Typography gutterBottom>
            Provider created:
          </Typography>
          <Typography gutterBottom>
            Patient payment:
          </Typography>
          <Typography gutterBottom>
            Lab kit mailed to patient:
          </Typography>
          <Typography gutterBottom>
            Lab kit received from patient:
          </Typography>
          <Typography>
            Lab completed test:
          </Typography>
        </Grid>
        <Grid item className={classes.ml2}>
          <Typography gutterBottom>
            {created ? `${dateFormat(created)} (${createdDaysDiff} ${constText})` : ""}
          </Typography>
          <Typography gutterBottom>
            {dt ? `${dateFormat(dt)} (${paymentDaysDiff} ${constText})` : ""}
          </Typography>
          <Typography gutterBottom>
            {sent_to_patient_dt
              ? `${dateFormat(sent_to_patient_dt)} (${sentToDaysDiff} ${constText})` : ""}
          </Typography>
          <Typography gutterBottom>
            {lab_receipt_dt
              ? `${dateFormat(lab_receipt_dt)} (${labReceiptDaysDiff} ${constText})` : ""}
          </Typography>
          <Typography>
            {completed_dt
              ? `${dateFormat(completed_dt)} (${completedDaysDiff} ${constText})` : ""}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

ToolTipContent.propTypes = {
  data: PropTypes.shape({
    marker_name: PropTypes.string,
    created: PropTypes.string,
    dt: PropTypes.string,
    completed_dt: PropTypes.string,
    lab_receipt_dt: PropTypes.string,
    sent_to_patient_dt: PropTypes.string,
  }).isRequired,
};

export default ToolTipContent;
