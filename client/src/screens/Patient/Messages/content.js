import React, { useMemo, useState } from "react";

import {
  Grid, Typography, Divider, Menu, MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import moment from "moment";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

import Alert from "../../../components/Alert";
import useAuth from "../../../hooks/useAuth";
import usePatientContext from "../../../hooks/usePatientContext";
import {
  setSelectedMessage, resetSelectedMessage, toggleMessageDialog, toggleMessageDialogPage, setMessageType,
} from "../../../providers/Patient/actions";
import PatientService from "../../../services/patient.service";

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(0.5),
  },
  text12: {
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: "wrap",
  },
  label: {
    marginRight: theme.spacing(1 / 2),
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  dateText: {
    minWidth: 80,
  },
  icon: {
    cursor: "pointer",
    marginTop: 5,
  },
}));

const MessagesContent = (props) => {
  const { reloadData } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { state, dispatch } = usePatientContext();
  const { data, selectedMessage } = state.messages;
  const { patientId } = state;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const openDeleteDialog = () => {
    setShowDeleteDialog((prevstate) => !prevstate);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog((prevstate) => !prevstate);
    dispatch(resetSelectedMessage());
  };

  const openMenu = (event, item) => {
    setAnchorEl(event.currentTarget);
    dispatch(setSelectedMessage(item));
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const deleteItemHandler = (item) => {
    const messageId = item.id;
    PatientService.deleteMessages(patientId, messageId)
      .then((response) => {
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        closeDeleteDialog();
        reloadData();
      });
  };

  const isDeletDisabled = useMemo(() => {
    if (selectedMessage && selectedMessage.user_id_from === user.id) {
      return false;
    }
    return true;
  }, [selectedMessage, user.id]);

  const isEditDisabled = useMemo(() => {
    if (selectedMessage && selectedMessage.user_id_from === user.id) {
      return false;
    }
    return true;
  }, [selectedMessage, user.id]);

  const isReplyDisabled = useMemo(() => {
    if (selectedMessage && selectedMessage.user_id_from === null) {
      return false;
    }
    return true;
  }, [selectedMessage]);

  return (
    <>
      <Alert
        open={showDeleteDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this message?"
        applyButtonText="Delete"
        cancelButtonText="Cancel"
        applyForm={() => deleteItemHandler(selectedMessage)}
        cancelForm={closeDeleteDialog}
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={isMenuOpen}
        onClose={closeMenu}
      >
        <MenuItem
          disabled={isDeletDisabled}
          onClick={() => {
            openDeleteDialog();
            closeMenu();
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          disabled={isEditDisabled}
          onClick={() => {
            dispatch(toggleMessageDialogPage());
            closeMenu();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          disabled={isReplyDisabled}
          onClick={() => {
            dispatch(setMessageType("Reply To"));
            dispatch(toggleMessageDialog());
            closeMenu();
          }}
        >
          Reply
        </MenuItem>
      </Menu>
      {data.map((item, index) => (
        <Grid key={item.id}>
          <Grid container spacing={1}>
            <Grid item className={classes.dateText}>
              {/* <Typography
                component="span"
                variant="body1"
                className={`${classes.text12} ${classes.label}`}
                color="textPrimary"
              >
                Date:
              </Typography> */}
              <Typography
                component="span"
                variant="body1"
                className={classes.text12}
                color="textPrimary"
              >
                {moment(item.created).format("MMM D YYYY")}
              </Typography>
            </Grid>

            <Grid item xs>
              <Grid container>
                {!!item.user_to_from && (
                  <Grid item xs={4}>
                    <Typography
                      component="span"
                      variant="body1"
                      className={`${classes.text12} ${classes.label}`}
                      color="textPrimary"
                    >
                      From:
                    </Typography>
                    <Typography
                      component="span"
                      variant="body1"
                      className={classes.text12}
                      color="textPrimary"
                    >
                      {item.user_to_from || ""}
                    </Typography>
                  </Grid>
                )}
                {!!item.user_to_name && (
                  <Grid item xs={4}>
                    <Typography
                      component="span"
                      variant="body1"
                      className={`${classes.text12} ${classes.label}`}
                      color="textPrimary"
                    >
                      To:
                    </Typography>
                    <Typography
                      component="span"
                      variant="body1"
                      className={classes.text12}
                      color="textPrimary"
                    >
                      {item.user_to_name || ""}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={!item.user_to_name || !item.user_to_from ? true : 4}>
                  <Typography
                    component="span"
                    variant="body1"
                    className={`${classes.text12} ${classes.label}`}
                    color="textPrimary"
                  >
                    Subject:
                  </Typography>
                  <Typography
                    component="span"
                    variant="body1"
                    className={classes.text12}
                    color="textPrimary"
                  >
                    {item.subject}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <MoreVertIcon
              fontSize="small"
              className={classes.icon}
              onClick={(e) => openMenu(e, item)}
            />
          </Grid>
          <Grid key={item.id}>
            <Typography
              variant="body1"
              className={classes.text12}
              color="textPrimary"
            >
              {item.message}
            </Typography>
          </Grid>
          {data.length !== index + 1 && <Divider className={classes.divider} />}
        </Grid>
      ))}
    </>
  );
};

MessagesContent.defaultProps = {
  reloadData: () => { },
};

MessagesContent.propTypes = {
  reloadData: PropTypes.func,
};

export default MessagesContent;
