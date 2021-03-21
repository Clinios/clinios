import React from "react";

import { IconButton, Button, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => createStyles({
  titleContainer: {
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    minHeight: 53,
  },
  content: {
    padding: "1rem 2rem",
    maxHeight: "86vh",
  },
  fullScreenContent: {
    maxHeight: "unset",
  },
  fullHeight: {
    minHeight: "86vh",
  },
  buttonClose: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  iconButton: {
    padding: theme.spacing(1),
  },
  buttonSkip: {
    display: "flex",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    right: 0,
  },
  skipText: {
    fontWeight: 600,
    fontSize: "1rem",
  },
  save: {
    background: theme.palette.success,
    minWidth: 100,
  },
  cancel: {
    background: theme.palette.error,
    minWidth: 100,
  },
}));

const DialogForm = ({
  title,
  open,
  message,
  applyForm,
  cancelForm,
  hideActions,
  backAction,
  continueNext,
  applyButtonText,
  cancelButtonText,
  size,
  fullScreen,
  fullHeight,
}) => {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        fullScreen={Boolean(fullScreen)}
        open={open}
        onClose={cancelForm}
        fullWidth
        maxWidth={size}
      // disableBackdropClick //enable esc button close and backdrop click
      >
        <>
          <DialogActions
            className={continueNext ? classes.buttonSkip : classes.buttonClose}
          >
            {continueNext && (
              <IconButton
                className={classes.iconButton}
                onClick={continueNext}
                aria-label="next"
              >
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            )}
            {cancelForm && (
              <IconButton
                className={classes.iconButton}
                onClick={cancelForm}
                aria-label="close"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            {backAction && (
              <IconButton
                className={classes.iconButton}
                onClick={applyForm}
                aria-label="back"
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            )}
          </DialogActions>
        </>
        <DialogTitle disableTypography className={classes.titleContainer} id="form-dialog-title">
          <Typography variant="h5">{title}</Typography>
        </DialogTitle>
        <DialogContent
          className={clsx({
            [classes.content]: true, // always apply
            [classes.fullHeight]: fullHeight, // only when fullHeight === true
            [classes.fullScreenContent]: fullScreen, // only when fullScreen === true
          })}
        >
          {message}
        </DialogContent>
        {hideActions ? null : (
          <>
            <DialogActions align="center">
              {applyForm && (
                <Button
                  className={classes.save}
                  onClick={applyForm}
                  color="primary"
                  type="submit"
                  variant="contained"
                >
                  {applyButtonText}
                </Button>
              )}
              {cancelForm && (
                <Button
                  className={classes.cancel}
                  onClick={cancelForm}
                  color="secondary"
                  type="submit"
                  variant="contained"
                >
                  {cancelButtonText}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

DialogForm.defaultProps = {
  title: "",
  message: null,
  applyForm: () => { },
  cancelForm: () => { },
  hideActions: true,
  backAction: null,
  continueNext: null,
  applyButtonText: "Continue",
  cancelButtonText: "Cancel",
  size: "lg",
  fullScreen: false,
  fullHeight: false,
};

DialogForm.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
  message: PropTypes.node,
  applyForm: PropTypes.func,
  cancelForm: PropTypes.func,
  hideActions: PropTypes.bool,
  backAction: PropTypes.func,
  continueNext: PropTypes.func,
  applyButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  size: PropTypes.string,
  fullScreen: PropTypes.bool,
  fullHeight: PropTypes.bool,
};

export default DialogForm;
