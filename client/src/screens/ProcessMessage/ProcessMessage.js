import React, { useCallback, useEffect, useState } from "react";

import {
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";

import MessageToUserService from "../../services/message-to-user.service";
import MessageSection from "./components/MessageSection";

const useStyles = makeStyles((theme) => ({
  gutterBottom: {
    marginBottom: theme.spacing(3),
  },
}));

const ProcessMessage = () => {
  const classes = useStyles();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(() => {
    MessageToUserService.getAllMessages().then((res) => {
      setMessages(res.data);
      setIsLoading(false);
    })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        color="textPrimary"
        className={classes.gutterBottom}
      >
        Message From Patient
      </Typography>
      {
        messages.length
          ? messages.map(((item, index) => (
            <Grid key={item.id}>
              <MessageSection
                message={item}
                showDivider={messages.length !== index + 1}
                fetchMessages={fetchMessages}
              />
            </Grid>
          )))
          : (
            <Typography variant="h5">
              {isLoading ? "Fetching Messages..." : "No Messages Found!"}
            </Typography>
          )
      }
    </>
  );
};

export default ProcessMessage;
