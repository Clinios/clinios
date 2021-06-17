import React, { useState, useEffect, useCallback } from "react";

import {
  Button,
  Grid,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

import Tooltip from "../../../../components/common/CustomTooltip";
import { StyledTableRowSm, StyledTableCellSm } from "../../../../components/common/StyledTable";
import useDidMountEffect from "../../../../hooks/useDidMountEffect";
import usePatientContext from "../../../../hooks/usePatientContext";
import { togglePaymentDialog } from "../../../../providers/Patient/actions";
import PatientService from "../../../../services/patient.service";

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down("md")]: {
      padding: 0,
    },
  },
  tableContainer: {
    marginTop: theme.spacing(1),
  },
  header: {
    minHeight: 38,
    display: "flex",
    alignItems: "flex-end",
  },
  pointer: {
    cursor: "pointer",
  },
  actionContainer: {
    marginTop: theme.spacing(2),
  },
  menuOption: {
    minHeight: 26,
  },
}));

const BillingDialog = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { state, dispatch } = usePatientContext();
  const { reloadData } = props;
  const [searchText, setSearchText] = useState("");
  const [hasUserSearched, setHasUserSearched] = useState(false);
  const [billings, setBillings] = useState([]);
  const [recentBillings, setRecentBillings] = useState([]);
  const [favoriteBillings, setFavoriteBillings] = useState([]);

  const { patientId } = state;

  const searchBillings = (e, text) => {
    e.preventDefault();
    const reqBody = {
      data: {
        text,
      },
    };
    PatientService.searchBilling(patientId, reqBody).then((res) => {
      setBillings(res.data);
      setHasUserSearched(true);
    });
  };

  const fetchRecentBillings = useCallback(() => {
    PatientService.getBillingRecents(patientId).then((response) => {
      setRecentBillings(response.data);
    });
  }, [patientId]);

  const fetchFavoriteBillings = useCallback(() => {
    PatientService.getBillingFavorites(patientId).then((response) => {
      setFavoriteBillings(response.data);
    });
  }, [patientId]);

  useEffect(() => {
    fetchRecentBillings();
    fetchFavoriteBillings();
  }, [fetchRecentBillings, fetchFavoriteBillings]);

  const onFormSubmit = (selectedTest) => {
    const reqBody = {
      data: {
        amount: selectedTest.price || selectedTest.fee || 0,
        proc_id: selectedTest.id,
        type_id: 1  // the 1 is hardcoded as per CLIN-203
      },
    };
    PatientService.createNewBilling(patientId, reqBody)
      .then((response) => {
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        reloadData();
        dispatch(togglePaymentDialog());
      });
  };

  useDidMountEffect(() => {
    if (!searchText.length) {
      setBillings([]);
      setHasUserSearched(false);
    }
  }, [searchText]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={4} xs={12}>
          <form onSubmit={(e) => searchBillings(e, searchText)}>
            <Grid container spacing={2} alignItems="center">
              <Grid item sm={9} xs={8}>
                <TextField
                  autoFocus
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  type="submit"
                  fullWidth
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCellSm>Name</StyledTableCellSm>
                  <StyledTableCellSm width="15%">Favorite</StyledTableCellSm>
                </TableRow>
              </TableHead>
              <TableBody>
                {billings.length
                  ? billings.map((item) => (
                    <StyledTableRowSm
                      key={item.marker_id}
                      className={classes.pointer}
                      onClick={() => onFormSubmit(item)}
                    >
                      {!!item.name && item.name.length > 30
                        ? (
                          <Tooltip title={item.name}>
                            <StyledTableCellSm
                              className={classes.overFlowControl}
                            >
                              {item.name}
                            </StyledTableCellSm>
                          </Tooltip>
                        )
                        : <StyledTableCellSm>{item.name}</StyledTableCellSm>}
                      <StyledTableCellSm>{item.favorite ? "Yes" : ""}</StyledTableCellSm>
                    </StyledTableRowSm>
                  ))
                  : hasUserSearched ? (
                    <StyledTableRowSm>
                      <StyledTableCellSm colSpan={4}>
                        <Typography align="center" variant="body1" className={classes.text}>
                          No Records found...
                        </Typography>
                      </StyledTableCellSm>
                    </StyledTableRowSm>
                  ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item md={4} xs={12}>
          <Grid className={classes.section}>
            <Grid className={classes.header}>
              <Typography variant="h5" color="textPrimary">
                Favorites
              </Typography>
            </Grid>
            <TableContainer className={classes.tableContainer}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCellSm>Name</StyledTableCellSm>
                    <StyledTableCellSm width="15%">Favorite</StyledTableCellSm>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {favoriteBillings.length
                    ? favoriteBillings.map((item) => (
                      <StyledTableRowSm
                        key={item.marker_id}
                        className={classes.pointer}
                        onClick={() => onFormSubmit(item)}
                      >
                        {!!item.name && item.name.length > 30
                          ? (
                            <Tooltip title={item.name}>
                              <StyledTableCellSm
                                className={classes.overFlowControl}
                              >
                                {item.name}
                              </StyledTableCellSm>
                            </Tooltip>
                          )
                          : <StyledTableCellSm>{item.name}</StyledTableCellSm>}
                        <StyledTableCellSm>{item.favorite ? "Yes" : ""}</StyledTableCellSm>
                      </StyledTableRowSm>
                    ))
                    : (
                      <StyledTableRowSm>
                        <StyledTableCellSm colSpan={4}>
                          <Typography align="center" variant="body1" className={classes.text}>
                            No Records found...
                          </Typography>
                        </StyledTableCellSm>
                      </StyledTableRowSm>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid item md={4} xs={12}>
          <Grid className={classes.section}>
            <Grid className={classes.header}>
              <Typography variant="h5" color="textPrimary">
                Recently Used
              </Typography>
            </Grid>
            <TableContainer className={classes.tableContainer}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCellSm>Name</StyledTableCellSm>
                    <StyledTableCellSm width="15%">Favorite</StyledTableCellSm>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBillings.length
                    ? recentBillings.map((item) => (
                      <StyledTableRowSm
                        key={item.marker_id}
                        className={classes.pointer}
                        onClick={() => onFormSubmit(item)}
                      >
                        {!!item.name && item.name.length > 30
                          ? (
                            <Tooltip title={item.name}>
                              <StyledTableCellSm
                                className={classes.overFlowControl}
                              >
                                {item.name}
                              </StyledTableCellSm>
                            </Tooltip>
                          )
                          : <StyledTableCellSm>{item.name}</StyledTableCellSm>}
                        <StyledTableCellSm>{item.favorite ? "Yes" : ""}</StyledTableCellSm>
                      </StyledTableRowSm>
                    ))
                    : (
                      <StyledTableRowSm>
                        <StyledTableCellSm colSpan={4}>
                          <Typography align="center" variant="body1" className={classes.text}>
                            No Records found...
                          </Typography>
                        </StyledTableCellSm>
                      </StyledTableRowSm>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

BillingDialog.propTypes = {
  reloadData: PropTypes.func.isRequired,
};

export default BillingDialog;
