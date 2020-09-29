import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
  Calendar,
  NewOrEditEvent,
  ProviderCards,
  ProviderDetailsCard,
  MessagesUnread,
  AppointmentRequests,
} from "./components";
import Appointments from "./../../../services/appointments.service";
import DashboardHome from "../../../services/DashboardHome.service";
import { setSuccess } from "./../../../store/common/actions";

const useStyles = makeStyles((theme) => ({
  pageTitle: {
    marginBottom: theme.spacing(2),
  },
  root: {
    flexGrow: 1,
    padding: "40px 0px",
  },
}));

export default function Home() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [providerDetails, setProviderDetails] = useState("");
  const [messagesUnread, setMessagesUnread] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [providers, setProviders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewEvent, setIsNewEvent] = useState(true);
  const getMapFromArray = (data) => {
    const formedData = data.reduce((acc, item) => {
      return [
        ...acc,
        {
          ...item,
          title: item.title ? item.title : item.firstname,
          start: item.start_dt,
          end: item.end_dt,
          backgroundColor:
            item.status && item.status === "D" ? "#ffab40" : "#2196f3",
        },
      ];
    }, []);

    return formedData;
  };

  useEffect(() => {
    async function fetchProviders() {
      const { data } = await DashboardHome.getProviders();
      setProviders(data);
      if (data.length > 0) {
        setSelectedProvider(data[0]);
        fetchEventsByProvider(data[0]);
      }
    }

    fetchProviders();
    fetchAppointments();
    fetchProviderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAppointments() {
    const { data } = await Appointments.getAll();
    const eventsFromAPI = getMapFromArray(data);
    setEvents(eventsFromAPI);
  }

  const handleProviderClick = async (provider) => {
    setSelectedProvider(provider);
    fetchEventsByProvider(provider);
    fetchUnreadPatientMessages(provider.id);
    fetchPatientApptRequests(provider.id);
  };

  async function fetchEventsByProvider(provider) {
    const { data } = await Appointments.getAllByProvider(provider.id);
    const eventsFromAPI = getMapFromArray(data);
    setEvents(eventsFromAPI);
  }

  async function fetchProviderDetails() {
    const { data } = await DashboardHome.getProviderDetails();
    setProviderDetails(data);
  }
  async function fetchUnreadPatientMessages(providerId) {
    const { data } = await DashboardHome.getPatientUnreadMessages(providerId);
    setMessagesUnread(data);
  }
  async function fetchPatientApptRequests(providerId) {
    const { data } = await DashboardHome.getPatientApptRequests(providerId);
    setAppointmentRequests(data);
  }
  const handleDayClick = (date) => {
    setIsNewEvent(true);
    setIsOpen(true);
    setSelectedDate(date);
  };

  const handleEventCreation = (payload) => {
    setIsLoading(true);
    Appointments.create(payload).then(
      (response) => {
        setIsLoading(false);
        fetchEventsByProvider(selectedProvider);
        dispatch(setSuccess(`${response.data.message}`));
        setIsOpen(false);
      },
      (error) => {
        setErrors(error.response.data.error);
      }
    );
  };

  const handleEventClick = (calEvent) => {
    setIsNewEvent(false);
    const eventClicked = events.filter(
      (event) => event.id === calEvent.event.id
    );
    setSelectedEvent(eventClicked[0]);
    setIsOpen(true);
  };

  const handleEventCancellation = (payload) => {
    setIsLoading(true);
    Appointments.cancelEvent(payload).then(
      (response) => {
        setIsLoading(false);
        fetchEventsByProvider(selectedProvider);
        dispatch(setSuccess(`${response.data.message}`));
        setIsOpen(false);
      },
      (error) => {
        setErrors(error.response.data.error);
      }
    );
  };

  const handleEventUpdate = (payload) => {
    setIsLoading(true);
    Appointments.update(payload).then(
      (response) => {
        setIsLoading(false);
        fetchEventsByProvider(selectedProvider);
        dispatch(setSuccess(`${response.data.message}`));
        setIsOpen(false);
      },
      (error) => {
        setErrors(error.response.data.error);
      }
    );
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h2"
        color="textPrimary"
        className={classes.pageTitle}
      >
        Home {selectedProvider && `- ${selectedProvider.name}`}
      </Typography>
      <Grid container spacing={8}>
        <Grid item md={7} xs={12}>
          <Calendar
            events={events}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
          />
        </Grid>
        <Grid item md={5} xs={12}>
          <ProviderCards
            providers={providers}
            handleProviderClick={handleProviderClick}
          />
          <ProviderDetailsCard
            selectedProvider={selectedProvider}
            providerDetails={providerDetails}
          />
          {!!selectedProvider && (
            <React.Fragment>
              <MessagesUnread
                appointmentRequests={appointmentRequests}
                messagesUnread={messagesUnread}
              />
              <AppointmentRequests
                selectedProvider={selectedProvider}
                appointmentRequests={appointmentRequests}
              />
            </React.Fragment>
          )}
        </Grid>
      </Grid>
      <NewOrEditEvent
        isLoading={isLoading}
        isNewEvent={isNewEvent}
        event={selectedEvent}
        selectedDate={selectedDate}
        selectedProvider={selectedProvider}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        providers={providers}
        onCancel={(payload) => handleEventCancellation(payload)}
        onSave={handleEventCreation}
        onEventUpdate={(payload) => handleEventUpdate(payload)}
        errors={errors}
      />
    </div>
  );
}
