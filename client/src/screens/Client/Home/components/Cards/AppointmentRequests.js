import React from "react";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Colors from "../../../../../theme/colors";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.light,
    fontWeight: "600",
    fontSize: "1em",
    "& h2": {
      color: "#fff",
    },
  },
  titleContainer: {
    padding: "0 0 0 1em",
    borderBottom: `1px solid ${Colors.border}`,
    minHeight: 47,
  },
  providers: {
    display: "block",
    listStyle: "none",
    width: "100%",
    "& li": {
      fontSize: "13px",
      display: "flex",
      justifyContent: "space-between",
      listStyle: "none",
      padding: "3px 0px",
      cursor: "pointer",
      "&:hover": {
        background: "#fafafa",
      },
      "& div": {
        flex: 2,
      },
    },
    "& a": {
      fontSize: "13px",
      display: "flex",
      justifyContent: "space-between",
      listStyle: "none",
      padding: "0px 0px",
      cursor: "pointer",
      textDecoration: "none",
      width: "100%",
      color: theme.palette.text.primary,
      "&:hover": {
        background: "#fafafa",
      },
      "& div": {
        flex: 2,
      },
    },
  },
  providersLabel: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  count: {
    width: "30px",
    flex: "1 !important",
  },
  PatientsApptRequest: {
    marginTop: theme.spacing(1),
    "& li": {
      fontSize: "13px",
      listStyle: "none",
      lineHeight: "19px",
      marginBottom: theme.spacing(1.5),
    },
  },
  unreadMsgActions: {
    display: "flex",
    width: "138px",
    justifyContent: "space-between",
    fontSize: "13px",
    marginTop: "3px",
    lineHeight: 1.75,

    "& a": {
      textDecoration: "none",
      fontSize: "13px",
      color: theme.palette.text.primary,
    },
    "& button": {
      border: "none",
      padding: 0,
      fontSize: "13px",
    },
  },
}));

const AppointmentRequests = ({ appointmentRequests, selectedProvider }) => {
  const classes = useStyles();

  return (
    <Card className={classes.PatientsApptRequest} variant="outlined">
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.titleContainer}
      >
        <Typography className={classes.title}>
          Patient Appointment Requests
        </Typography>
      </Grid>
      <CardContent>
        <ul>
          {appointmentRequests.length > 0 ? (
            appointmentRequests.map((appt) => (
              <li key={appt.id}>
                {moment(appt.created).format("ll")}, {appt.name}, requests
                office visits{" "}
                {moment
                  .duration(moment(appt.end_dt).diff(moment(appt.start_dt)))
                  .asMinutes()}{" "}
                minutes with {selectedProvider.name} on{" "}
                {moment(appt.start_dt).format("ll, h:mm")} -{" "}
                {moment(appt.end_dt).format("h:mm")}
                <div className={classes.unreadMsgActions}>
                  <Button>Accept</Button>
                  <Button>Reject</Button>
                  <Button>Message</Button>
                </div>
              </li>
            ))
          ) : (
            <p>No record!</p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AppointmentRequests;
