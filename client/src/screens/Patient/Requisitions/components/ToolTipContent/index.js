import React from "react";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { dateFormat, dateDiffInDays } from "../../../../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  ml2: {
    marginLeft: theme.spacing(2),
  },
}));

const currentDate = new Date();

const ToolTipContent = (props) => {
  const classes = useStyles();
  const { data } = props;
  const {
    dt, completed_dt, lab_receipt_dt, sent_to_patient_dt,
  } = data;

  const paymentDaysDiff = dt && dateDiffInDays(dt, currentDate);
  const completedDaysDiff = completed_dt && dateDiffInDays(completed_dt, currentDate);
  const labReceiptDaysDiff = lab_receipt_dt && dateDiffInDays(lab_receipt_dt, currentDate);
  const sentToDaysDiff = sent_to_patient_dt && dateDiffInDays(sent_to_patient_dt, currentDate);
  const noDateMessage = "Not Available";
  const daysText = "(days ago)";

  return (
    <>
      <Grid container md={12}>
        <Grid item xs>
          <Typography item gutterBottom>
            Patient payment:
          </Typography>
          <Typography item gutterBottom>
            Lab kit mailed to patient:
          </Typography>
          <Typography item gutterBottom>
            Lab kit received from patient:
          </Typography>
          <Typography item>
            Lab completed test:
          </Typography>
        </Grid>
        <Grid item className={classes.ml2}>
          <Typography item gutterBottom>
            {dt ? `${dateFormat(dt)} ${paymentDaysDiff} ${daysText}` : noDateMessage}
          </Typography>
          <Typography item gutterBottom>
            {sent_to_patient_dt
              ? `${dateFormat(sent_to_patient_dt)} ${sentToDaysDiff} ${daysText}` : noDateMessage}
          </Typography>
          <Typography item gutterBottom>
            {lab_receipt_dt
              ? `${dateFormat(lab_receipt_dt)} ${labReceiptDaysDiff} ${daysText}` : noDateMessage}
          </Typography>
          <Typography item>
            {completed_dt
              ? `${dateFormat(completed_dt)} ${completedDaysDiff} ${daysText}` : noDateMessage}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

ToolTipContent.propTypes = {
  data: PropTypes.shape({
    dt: PropTypes.string,
    completed_dt: PropTypes.string,
    lab_receipt_dt: PropTypes.string,
    sent_to_patient_dt: PropTypes.string,
  }).isRequired,
};

export default ToolTipContent;
