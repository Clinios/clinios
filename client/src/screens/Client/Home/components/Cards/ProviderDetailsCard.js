import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
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
}));

const ProviderDetailsCard = ({ selectedProvider, providerDetails }) => {
  const classes = useStyles();

  return (
    <Card className={classes.providerDetails} variant="outlined">
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.titleContainer}
      >
        <Typography className={classes.title}>
          Provider Details
          {selectedProvider && ` - ${selectedProvider.name}`}
        </Typography>
      </Grid>

      <CardContent>
        <ul className={classes.providers}>
          <li className={classes.providersLabel}>
            <div>Type</div>
            <div className={classes.count}>Count</div>
            <div>Since</div>
          </li>
          <li>
            <Link
              to={
                selectedProvider ? `/process-lab/${selectedProvider.id}` : "#"
              }
            >
              <div>Patient Labs</div>
              <div className={classes.count}>
                {!!providerDetails &&
                  providerDetails.patientLabs &&
                  providerDetails.patientLabs["count(l.id)"]}
              </div>
              <div>
                {!!providerDetails &&
                  providerDetails.patientLabs &&
                  `${moment(
                    providerDetails.patientLabs["min(l.created)"]
                  ).format("ll")} (${moment(
                    providerDetails.patientLabs["min(l.created)"]
                  )
                    .startOf("day")
                    .fromNow()})`}
              </div>
            </Link>
          </li>

          <li>
            <Link to={`/process-message/${selectedProvider.id}`}>
              <div>Messages from Patients</div>
              <div className={classes.count}>
                {!!providerDetails &&
                  providerDetails.messageFromPatients &&
                  providerDetails.messageFromPatients["count(m.id)"]}
              </div>
              <div>
                {!!providerDetails &&
                  providerDetails.patientLabs &&
                  `${moment(
                    providerDetails.patientLabs["min(m.created)"]
                  ).format("ll")} (${moment(
                    providerDetails.patientLabs["min(m.created)"]
                  )
                    .startOf("day")
                    .fromNow()})`}
              </div>
            </Link>
          </li>
          <li>
            <div>Messages To Patient Unread</div>
            <div className={classes.count}>
              {!!providerDetails &&
                providerDetails.messageToPatientsNotRead &&
                providerDetails.messageToPatientsNotRead["count(m.id)"]}
            </div>
            <div>
              {!!providerDetails &&
              providerDetails.messageToPatientsNotRead &&
              providerDetails.messageToPatientsNotRead[
                "min(m.unread_notify_dt)"
              ]
                ? `${moment(
                    providerDetails.messageToPatientsNotRead[
                      "min(m.unread_notify_dt)"
                    ]
                  ).format("ll")} (${moment(
                    providerDetails.messageToPatientsNotRead[
                      "min(m.unread_notify_dt)"
                    ]
                  )
                    .startOf("day")
                    .fromNow()})`
                : "-"}
            </div>
          </li>
          <li>
            <div>Patient Appointments Request</div>
            <div className={classes.count}>
              {!!providerDetails &&
                providerDetails.patientAppointmentRequest &&
                providerDetails.patientAppointmentRequest["count(m.id)"]}
            </div>
            <div>
              {!!providerDetails &&
              providerDetails.patientAppointmentRequest &&
              providerDetails.patientAppointmentRequest[
                "min(m.unread_notify_dt)"
              ]
                ? `${moment(
                    providerDetails.patientAppointmentRequest[
                      "min(m.unread_notify_dt)"
                    ]
                  ).format("ll")} (${moment(
                    providerDetails.messageToPatientsNotRead[
                      "min(m.unread_notify_dt)"
                    ]
                  )
                    .startOf("day")
                    .fromNow()})`
                : "-"}
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default ProviderDetailsCard;
