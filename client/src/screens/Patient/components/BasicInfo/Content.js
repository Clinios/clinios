import React, { useEffect, useState } from "react";

import { Grid, Typography, Popover } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import PatientService from "../../../../services/patient.service";
import {
  calculateAge,
  formatPhoneNumber,
  dateDiffInDays,
  dateDiffInMonths,
  dateDiffInYears,
} from "../../../../utils/helpers";

export default function BasicInfoContent(props) {
  const classes = useStyles();
  const { data, patientId } = props;
  const [nextAppointment, setNextAppointment] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchNextAppointment = () => {
      PatientService.getNextAppointment(patientId).then((res) => {
        setNextAppointment(
          res.data && res.data.length ? res.data[0].start_dt : "",
        );
      });
    };
    fetchNextAppointment();
  }, [patientId]);

  const calculateDateDifference = () => {
    const d1 = new Date();
    const d2 = new Date(nextAppointment);

    const daysDiff = dateDiffInDays(d1, d2);
    const monthsDiff = dateDiffInMonths(d1, d2);
    const yearsDiff = dateDiffInYears(d1, d2);

    if (yearsDiff > 0) {
      return yearsDiff > 1 ? `${yearsDiff} years` : `${yearsDiff} year`;
    } if (monthsDiff > 0) {
      return monthsDiff > 1 ? `${monthsDiff} months` : `${monthsDiff} month`;
    }
    return daysDiff > 1 ? `${daysDiff} days` : `${daysDiff} day`;
  };

  const mapGender = (value) => {
    let genderString = "";
    if (value === "M") {
      genderString = "Male";
    } else if (value === "F") {
      genderString = "Female";
    } else {
      genderString = "Not Specified";
    }
    return genderString;
  };

  const isEllipsisActive = (event) => {
    const e = event.target;
    if (e.scrollWidth > e.clientWidth) {
      setAnchorEl(e);
      setShowTooltip(true);
    }
  };

  const handleClose = () => {
    if (showTooltip) {
      setShowTooltip(false);
      setAnchorEl(null);
    }
  };

  return (
    <>
      <Popover
        id="tooltip"
        open={showTooltip}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: classes.paper,
        }}
        className={classes.popover}
        disableRestoreFocus
      >
        {!!showTooltip && <Typography>{anchorEl.innerText}</Typography>}
      </Popover>
      <Grid container className={classes.inputRow}>
        <Typography
          variant="body1"
          className={classes.text12}
          color="textPrimary"
        >
          Name:&nbsp;
        </Typography>
        <Typography
          variant="body1"
          className={`${classes.text12} ${classes.value}`}
          color="textPrimary"
          onMouseOver={(e) => isEllipsisActive(e)}
          onMouseOut={() => handleClose()}
        >
          {data.firstname}
          {" "}
          {data.lastname}
        </Typography>
      </Grid>

      <Grid container className={classes.inputRow}>
        <Typography
          variant="body1"
          className={classes.text12}
          color="textPrimary"
        >
          Gender:&nbsp;
        </Typography>
        <Typography
          variant="body1"
          className={`${classes.text12} ${classes.value}`}
          color="textPrimary"
          onMouseOver={(e) => isEllipsisActive(e)}
          onMouseOut={() => handleClose()}
        >
          {mapGender(data.gender)}
        </Typography>
      </Grid>

      <Grid container className={classes.inputRow}>
        <Typography
          variant="body1"
          className={classes.text12}
          color="textPrimary"
        >
          DOB:&nbsp;
        </Typography>
        <Typography
          variant="body1"
          className={`${classes.text12} ${classes.value}`}
          color="textPrimary"
          onMouseOver={(e) => isEllipsisActive(e)}
          onMouseOut={() => handleClose()}
        >
          {moment(data.dob).format("MMM D YYYY")}
          {" "}
          (Age:&nbsp;
          {calculateAge(data.dob)}
          )
        </Typography>
      </Grid>

      <Grid container className={classes.inputRow}>
        <Typography
          variant="body1"
          className={classes.text12}
          color="textPrimary"
        >
          Home:&nbsp;
        </Typography>
        <Typography
          variant="body1"
          className={`${classes.text12} ${classes.value}`}
          color="textPrimary"
          onMouseOver={(e) => isEllipsisActive(e)}
          onMouseOut={() => handleClose()}
        >
          {formatPhoneNumber(data.phone_home)}
        </Typography>
      </Grid>

      <Grid container className={classes.inputRow}>
        <Typography
          variant="body1"
          className={classes.text12}
          color="textPrimary"
        >
          Mobile:&nbsp;
        </Typography>
        <Typography
          variant="body1"
          className={`${classes.text12} ${classes.value}`}
          color="textPrimary"
          onMouseOver={(e) => isEllipsisActive(e)}
          onMouseOut={() => handleClose()}
        >
          {formatPhoneNumber(data.phone_cell)}
        </Typography>
      </Grid>

      <Grid container className={classes.inputRow}>
        <Typography
          variant="body1"
          className={classes.text12}
          color="textPrimary"
        >
          Provider:&nbsp;
        </Typography>
        <Typography
          variant="body1"
          className={`${classes.text12} ${classes.value}`}
          color="textPrimary"
          onMouseOver={(e) => isEllipsisActive(e)}
          onMouseOut={() => handleClose()}
        >
          {data.provider}
        </Typography>
      </Grid>

      <Grid container className={classes.inputRow}>
        <Typography
          variant="body1"
          className={classes.text12}
          color="textPrimary"
        >
          Next Appointment:&nbsp;
        </Typography>
        <Typography
          variant="body1"
          className={`${classes.text12} ${classes.value}`}
          color="textPrimary"
          onMouseOver={(e) => isEllipsisActive(e)}
          onMouseOut={() => handleClose()}
        >
          {nextAppointment
            ? moment(nextAppointment).format("MMM D YYYY")
            : ""}
          {" "}
          {!!nextAppointment && `(In ${calculateDateDifference()})`}
        </Typography>
      </Grid>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(0.5),
    flexWrap: "nowrap",
  },
  text12: {
    fontSize: 12,
  },
  value: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  paper: {
    padding: theme.spacing(1),
    maxWidth: 400,
    wordWrap: "break-word",
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 13,
  },
  popover: {
    pointerEvents: "none",
  },
}));
