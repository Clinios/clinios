import React, { useCallback, useState } from "react";

import { Grid, Typography, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import moment from "moment";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

import Alert from "../../../components/Alert";
import Popover from "../../../components/common/Popover";
import usePatientContext from "../../../hooks/usePatientContext";
import PatientService from "../../../services/patient.service";
import ToolTipContent from "./components/ToolTipContent";

const useStyles = makeStyles((theme) => ({
  text12: {
    fontSize: 12,
  },
  inputRow: {
    flexWrap: "nowrap",
    width: "max-content",
    display: "flex",
    alignItems: "center",
  },
  block: {
    width: 90,
    minWidth: 90,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: theme.spacing(0, 0.5, 0, 0),
  },
  fullWidth: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: theme.spacing(0, 0.5, 0, 0),
    maxWidth: "65%",
  },
  blockAction: {
    "& button": {
      padding: 2,
    },
    "& svg": {
      fontSize: "1rem",
      cursor: "pointer",
    },
  },
}));

const RequisitionsContent = (props) => {
  const classes = useStyles();
  const { reloadData } = props;
  const { state } = usePatientContext();
  const { enqueueSnackbar } = useSnackbar();
  const { patientId } = state;
  const { data } = state.requisitions;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequisition, setSelectedRequisition] = useState(null);

  const openDeleteDialog = (item) => {
    setSelectedItem(item);
    setShowDeleteDialog((prevstate) => !prevstate);
  };

  const closeDeleteDialog = () => {
    setSelectedItem(null);
    setShowDeleteDialog((prevstate) => !prevstate);
  };

  const deleteItemHandler = (item) => {
    const requisitionId = item.id;
    PatientService.deleteRequisitions(patientId, requisitionId)
      .then((response) => {
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        reloadData();
        closeDeleteDialog();
      });
  };

  const showPopover = Boolean(selectedRequisition);

  const handlePopoverOpen = (event, requisition) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequisition(requisition);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedRequisition(null);
  };

  const isDeleteIconDisabled = useCallback((requisition) => {
    let res = false;
    if (requisition.dt !== null || requisition.completed_dt !== null
      || requisition.lab_receipt_dt !== null || requisition.sent_to_patient_dt !== null) {
      res = true;
    }
    return res;
  }, []);

  return (
    <>
      <Alert
        open={showDeleteDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this requisition?"
        applyButtonText="Delete"
        cancelButtonText="Cancel"
        applyForm={() => deleteItemHandler(selectedItem)}
        cancelForm={closeDeleteDialog}
      />
      {
        showPopover && (
          <Popover
            open={showPopover}
            anchorEl={anchorEl}
            handlePopoverClose={handlePopoverClose}
          >
            <ToolTipContent data={selectedRequisition} />
          </Popover>
        )
      }
      {
        data.map((item) => (
          <Grid
            key={item.id}
            className={classes.inputRow}
            onMouseEnter={(e) => handlePopoverOpen(e, item)}
            onMouseLeave={handlePopoverClose}
          >
            <Typography
              component="span"
              className={`${classes.text12} ${classes.block}`}
              color="textPrimary"
            >
              {moment(item.created).format("MMM D YYYY")}
            </Typography>
            <Typography
              component="span"
              className={`${classes.text12} ${classes.fullWidth}`}
              color="textPrimary"
            >
              {item.marker_name}
            </Typography>
            <Grid item className={classes.blockAction}>
              <IconButton
                onClick={() => openDeleteDialog(item)}
                disabled={isDeleteIconDisabled(item)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))
      }
    </>
  );
};

RequisitionsContent.propTypes = {
  reloadData: PropTypes.func.isRequired,
};

export default RequisitionsContent;
