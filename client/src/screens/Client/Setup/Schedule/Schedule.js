import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  makeStyles
} from "@material-ui/core";
import Video from "./../../../../components/videos/Video";
import { AuthConsumer } from "../../../../providers/AuthProvider";
import ScheduleSearchForm from "./component/ScheduleSearchForm";
import ScheduleSearchResultTable from "./component/ScheduleSearchResultTable";
import NewOrEditSchedule from "./component/modal/NewOrEditSchedule";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "40px 0px"
  },
  uploadButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "480px",
    "& h1": {
      [theme.breakpoints.up("md")]: {
        marginRight: theme.spacing(1)
      }
    }
  },
  card: {
    minHeight: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
}));

const Schedule = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [isNewSchedule, setIsNewSchedule] = useState(true);

  const handleOnNewClick = () => {
    setIsOpen(true);
    setIsNewSchedule(true);
  };
  const handleOnEditClick = () => {
    setIsOpen(true);
    setIsNewSchedule(false);
  };

  const handleOnClose = () => {
    setIsOpen(false);
  };

  return (
    <AuthConsumer>
      {({ user }) => (
        <React.Fragment>
          <CssBaseline>
            <Container maxWidth={false} className={classes.root}>
              <div className={classes.uploadButtons}>
                <Typography component="h1" variant="h2" color="textPrimary">
                  Schedule
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                  onClick={handleOnNewClick}
                >
                  New
                </Button>
              </div>
              <Grid container justify="center" spacing={2}>
                <Grid item md={12} xs={12}>
                  <Typography component="p" variant="body2" color="textPrimary">
                    This page is used to set availability for patient
                    appointments.
                  </Typography>
                  <ScheduleSearchForm />
                  <ScheduleSearchResultTable
                    handleOnEditClick={handleOnEditClick}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h4" gutterBottom>
                        <Video url="https://www.youtube.com/watch?v=ysz5S6PUM-U" />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <NewOrEditSchedule
                isOpen={isOpen}
                handleOnClose={handleOnClose}
                isNewSchedule={isNewSchedule}
              />
            </Container>
          </CssBaseline>
        </React.Fragment>
      )}
    </AuthConsumer>
  );
};

export default Schedule;
