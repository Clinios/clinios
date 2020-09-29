import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
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
  messageToPatientsUnread: {
    marginTop: theme.spacing(8),
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

const MessagesUnread = ({ appointmentRequests, messagesUnread }) => {
  const classes = useStyles();

  return (
    <Card className={classes.messageToPatientsUnread} variant="outlined">
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.titleContainer}
      >
        <Typography className={classes.title}>
          Messages to Patients Unread
        </Typography>
      </Grid>
      <CardContent>
        <ul>
          {appointmentRequests.length > 0 ? (
            messagesUnread.map((msg) => (
              <li key={msg.id}>
                {moment(msg.created).format("ll")}, {msg.name}, {msg.subject},{" "}
                {msg.message}
                <div className={classes.unreadMsgActions}>
                  <Link to="/patient">Patient</Link>
                  <Button>Edit Message</Button>
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

export default MessagesUnread;
