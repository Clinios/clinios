import React, {
  useState, useEffect, useCallback,
} from "react";

import {
  makeStyles,
  Grid,
  Button,
  Switch,
  Typography,
  IconButton,
  FormControlLabel,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import { isEmpty } from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";

import Alert from "../../../../components/Alert";
import { StyledTableCellLg, StyledTableRowLg } from "../../../../components/common/StyledTable";
import useAuth from "../../../../hooks/useAuth";
import LabRangeService from "../../../../services/setup/labrange.service";
import NewLabRange from "./components/NewLabRange";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "25px 0px",
  },
  w100: {
    minWidth: 100,
  },
  mb2: {
    marginBottom: theme.spacing(2),
  },
  labelContainer: {
    pointerEvents: "none",
  },
  label: {
    fontSize: 16,
    marginRight: theme.spacing(1),
  },
  pointerEnable: {
    pointerEvents: "auto",
  },
}));

const LabRanges = () => {
  const classes = useStyles();
  const { user: { client_id } } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedRange, setSelectedRange] = useState({});
  const [showNewRangeDialog, setShowNewRangeDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [useFuncRange, setUseFuncRange] = useState(true);
  const [labRanges, setLabRanges] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openDeleteDialog = (item) => {
    setSelectedRange(item);
    setShowDeleteDialog((prevstate) => !prevstate);
  };

  const closeDeleteDialog = () => {
    setSelectedRange({});
    setShowDeleteDialog((prevstate) => !prevstate);
  };

  const openResetDialog = () => {
    setShowResetDialog((prevstate) => !prevstate);
  };

  const closeResetDialog = () => {
    setShowResetDialog((prevstate) => !prevstate);
  };

  const resetButtonHandler = () => {
    if (client_id === 1) {
      enqueueSnackbar(`This function is not available for client #1`, { variant: "error" });
    } else {
      openResetDialog();
    }
  };

  const fetchLabRanges = useCallback(() => {
    LabRangeService.getLabRanges().then((res) => {
      setLabRanges(res.data);
      setIsLoading(false);
    })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchLabRanges();
  }, [fetchLabRanges]);

  const handleChangeFuncRange = () => {
    setUseFuncRange((prevState) => !prevState);
  };

  const deleteItemHandler = (item) => {
    const deleteItemId = item.id;
    const reqBody = {
      data: {
        cpt_id: item.cpt_id,
        seq: item.seq,
        compare_item: item.compare_item,
        compare_operator: item.compare_operator,
        compare_to: item.compare_to,
      },
    };
    LabRangeService.deleteLabRange(reqBody, deleteItemId).then((res) => {
      enqueueSnackbar(`${res.message}`, { variant: "success" });
      closeDeleteDialog();
      fetchLabRanges();
    });
  };

  const editItemHandler = (item) => {
    setSelectedRange(item);
    setShowNewRangeDialog(true);
  };

  const applyResetHandler = () => {
    LabRangeService.resetLabRanges().then((res) => {
      enqueueSnackbar(`${res.message}`, { variant: "success" });
      closeResetDialog();
    });
  };

  return (
    <>
      <Alert
        open={showResetDialog}
        title="Confirm Reset"
        message="Are you sure you want to reset all custom lab ranges to the original values?"
        applyButtonText="Reset"
        cancelButtonText="Cancel"
        applyForm={applyResetHandler}
        cancelForm={closeResetDialog}
      />
      <Alert
        open={showDeleteDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this functional range?"
        applyButtonText="Delete"
        cancelButtonText="Cancel"
        applyForm={() => deleteItemHandler(selectedRange)}
        cancelForm={closeDeleteDialog}
      />
      {!!showNewRangeDialog && (
        <NewLabRange
          isOpen={showNewRangeDialog}
          onClose={() => {
            if (!isEmpty(selectedRange)) {
              setSelectedRange({});
            }
            setShowNewRangeDialog(false);
          }}
          reloadData={fetchLabRanges}
          selectedItem={selectedRange}
        />
      )}
      <div className={classes.root}>
        <Grid
          container
          justify="space-between"
          className={classes.mb2}
        >
          <Grid item lg={6}>
            <Grid container justify="space-between">
              <Typography
                component="h1"
                variant="h2"
                color="textPrimary"
                className={classes.title}
              >
                Functional Lab Ranges
              </Typography>
              <Button
                variant="outlined"
                className={classes.w100}
                onClick={() => setShowNewRangeDialog(true)}
              >
                New
              </Button>
              <FormControlLabel
                control={(
                  <Switch
                    checked={useFuncRange}
                    color="primary"
                    size="medium"
                    name="switchBox"
                    onChange={handleChangeFuncRange}
                    inputProps={{ "aria-label": "secondary checkbox" }}
                    className={classes.pointerEnable} // enable clicking on switch only
                  />
                )}
                label="Use Functional Range"
                labelPlacement="start"
                classes={{
                  label: classes.label,
                  root: classes.labelContainer, // to disable clicking of label
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              component="label"
              className={classes.w100}
              onClick={() => resetButtonHandler()}
              disabled={!labRanges.length}
            >
              Reset Values
            </Button>
          </Grid>
        </Grid>

        <TableContainer className={classes.mb2}>
          <Table size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCellLg>Test</StyledTableCellLg>
                <StyledTableCellLg>Sequence</StyledTableCellLg>
                <StyledTableCellLg>Compare Item</StyledTableCellLg>
                <StyledTableCellLg>Operator</StyledTableCellLg>
                <StyledTableCellLg>Compare To</StyledTableCellLg>
                <StyledTableCellLg>Low</StyledTableCellLg>
                <StyledTableCellLg>High</StyledTableCellLg>
                <StyledTableCellLg>Created</StyledTableCellLg>
                <StyledTableCellLg>Updated</StyledTableCellLg>
                <StyledTableCellLg align="center">Actions</StyledTableCellLg>
              </TableRow>
            </TableHead>
            <TableBody>
              {labRanges && labRanges.length
                ? labRanges.map((item) => (
                  <StyledTableRowLg key={`${item.cpt_id}_${item.cpt_name}_${item.range_low}_${item.seq}`}>
                    <TableCell>{item.cpt_name}</TableCell>
                    <TableCell>{item.seq}</TableCell>
                    <TableCell>{item.compare_item}</TableCell>
                    <TableCell>{item.compare_operator}</TableCell>
                    <TableCell>{item.compare_to}</TableCell>
                    <TableCell>{item.range_low}</TableCell>
                    <TableCell>{item.range_high}</TableCell>
                    <TableCell>
                      {item.created ? moment(item.created).format("MMM D YYYY") : ""}
                    </TableCell>
                    <TableCell>
                      {item.updated ? moment(item.updated).format("MMM D YYYY") : ""}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => editItemHandler(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => openDeleteDialog(item)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </StyledTableRowLg>
                ))
                : (
                  <StyledTableRowLg>
                    <TableCell colSpan={10}>
                      <Typography align="center" variant="body1">
                        {isLoading ? "Fetching Lab Ranges..." : "No Records Found..."}
                      </Typography>
                    </TableCell>
                  </StyledTableRowLg>
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default LabRanges;
