import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";

import { AuthConsumer } from "./../../../../providers/AuthProvider";
import AppointmentService from "./../../../../services/appointmentType.service";
import { Appointments } from "./components";
import DeleteAppointmentModal from "./components/modal/DeleteAppointment";
import NewOrEditAppointment from "./components/modal/NewOrEditAppointment";
//import Video from "./../../../../components/videos/Video";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "40px 0px"
  },
  uploadButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "450px",
    marginBottom: theme.spacing(1),
    "& h1": {
      [theme.breakpoints.up("md")]: {
        marginRight: theme.spacing(4)
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

export default function AppointmentTypes(props) {
  const classes = useStyles();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [selectedappointment, setSelectedAppointment] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [isNewAppointment, setIsNewAppointment] = useState(true);

  const fetchAppointmentTypes = () => {
    AppointmentService.getAll().then((res) => {
      setAppointments(res.data);
    });
  };

  useEffect(() => {
    fetchAppointmentTypes();
  }, []);

  const handleEditButtonClick = (id) => {
    setIsEditModalOpen(true);
    setIsNewAppointment(false);
    const appointmentById = appointments.filter(
      (appointment) => appointment.id === id
    );
    appointmentById && setSelectedAppointment(_.head(appointmentById)); // eslint-disable-line mdx/no-unused-expressions
  };

  const handleDeleteButton = (id) => {
    setIsDeleteModalOpen(true);
    setSelectedAppointmentId(id);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setIsNewAppointment(false);
    fetchAppointmentTypes();
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    fetchAppointmentTypes();
  };

  const handleOnNewClick = () => {
    setIsEditModalOpen(true);
    setIsNewAppointment(true);
    setSelectedAppointment("");
  };

  return (
    <AuthConsumer>
      {({ user }) => (
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth={false} className={classes.root}>
            <div className={classes.uploadButtons}>
              <Typography component="h1" variant="h2" color="textPrimary">
                Appointment Types
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component="span"
                onClick={() => handleOnNewClick()}
              >
                New
              </Button>
            </div>
            <Grid container justify="center" spacing={2}>
              <Grid item md={12} xs={12}>
                <Typography component="p" variant="body2" color="textPrimary">
                  This page is used to manage appointment types that are offered
                  to patients
                </Typography>
                <Appointments
                  appointments={appointments}
                  onEdit={handleEditButtonClick}
                  onDelete={handleDeleteButton}
                />
              </Grid>
              {/*}
              <Grid item md={12} xs={12}>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>
                      <Video url="https://www.youtube.com/watch?v=ysz5S6PUM-U" />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            */}
            </Grid>
            <NewOrEditAppointment
              appointment={selectedappointment}
              isOpen={isEditModalOpen}
              onClose={() => handleEditModalClose(false)}
              user={user}
              isNewAppointment={isNewAppointment}
            />
            <DeleteAppointmentModal
              id={selectedAppointmentId}
              isOpen={isDeleteModalOpen}
              onClose={() => handleDeleteModalClose(false)}
            />
          </Container>
        </React.Fragment>
      )}
    </AuthConsumer>
  );
}
