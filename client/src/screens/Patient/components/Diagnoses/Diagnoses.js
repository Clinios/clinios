import React, { useState, useEffect, useCallback } from "react";

import {
  Grid,
  TextField,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";

import { StyledTableRowSm, StyledTableCellSm } from "../../../../components/common/StyledTable";
import useDidMountEffect from "../../../../hooks/useDidMountEffect";
import usePatientContext from "../../../../hooks/usePatientContext";
import { toggleDiagnosesDialog } from "../../../../providers/Patient/actions";
import PatientService from "../../../../services/patient.service";

const useStyles = makeStyles((theme) => ({
  inputRow: {
    margin: theme.spacing(3, 0),
  },
  mb2: {
    marginBottom: theme.spacing(2),
  },
  ml2: {
    marginLeft: theme.spacing(2),
  },
  border: {
    border: "1px solid grey",
    padding: 10,
  },
  height100: {
    height: "100%",
  },
  actionContainer: {
    paddingTop: theme.spacing(2),
  },
  text: {
    lineHeight: "21px",
  },
  pointer: {
    cursor: "pointer",
  },
  hidden: {
    color: theme.palette.common.white,
  },
}));

const Diagnoses = (props) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { reloadData } = props;
  const [searchText, setSearchText] = useState("");
  const [diagnosis, setDiagnosis] = useState([]);
  const [recentICDs, setRecentICDs] = useState([]);
  const [favoriteICDs, setFavoriteICDs] = useState([]);

  const { state, dispatch } = usePatientContext();
  const { patientId } = state;

  const onFormSubmit = (diagnoses) => {
    const reqBody = {
      data: {
        icd_id: diagnoses.id,
      },
    };
    PatientService.createDiagnoses(patientId, reqBody)
      .then((response) => {
        enqueueSnackbar(`${response.data.message}`, { variant: "success" });
        reloadData();
        dispatch(toggleDiagnosesDialog());
      });
  };

  const fetchRecentICDs = useCallback(() => {
    PatientService.getDiagnosesRecentICDs(patientId).then((response) => {
      setRecentICDs(response.data);
    });
  }, [patientId]);

  const fetchFavoriteICDs = useCallback(() => {
    PatientService.getDiagnosesFavoriteICDs(patientId).then((response) => {
      setFavoriteICDs(response.data);
    });
  }, [patientId]);

  useEffect(() => {
    fetchRecentICDs();
    fetchFavoriteICDs();
  }, [fetchRecentICDs, fetchFavoriteICDs]);

  const fetchDiagnosis = (e, text) => {
    e.preventDefault();
    PatientService.searchICD(text).then((res) => {
      setDiagnosis(res.data);
    });
  };

  useDidMountEffect(() => {
    if (!searchText.length) {
      setDiagnosis([]);
    }
  }, [searchText]);

  return (
    <>
      {/* Commented out David Feb 2021
      <Grid className={classes.mb2} container justify="space-between">
        <Typography variant="h3" color="textSecondary">
          Diagnoses
        </Typography>
      </Grid>
      */}

      <Grid item xs={4}>
        <form onSubmit={(e) => fetchDiagnosis(e, searchText)}>
          <Grid container alignItems="center" className={classes.mb2}>
            <Grid item xs>
              <TextField
                autoFocus
                fullWidth
                required
                size="small"
                variant="outlined"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Grid>
            <Button
              variant="outlined"
              type="submit"
              className={classes.ml2}
            >
              Search
            </Button>
          </Grid>
        </form>
      </Grid>

      <Grid container spacing={2} className={classes.mb2}>
        <Grid item lg={4}>
          <Typography variant="h4" className={classes.hidden}>
            Search Results
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCellSm>Name</StyledTableCellSm>
                  <StyledTableCellSm>ID</StyledTableCellSm>
                  <StyledTableCellSm>Favorite</StyledTableCellSm>
                </TableRow>
              </TableHead>
              <TableBody>
                {diagnosis.length
                  ? diagnosis.map((item) => (
                    <StyledTableRowSm
                      key={item.id}
                      className={classes.pointer}
                      onClick={() => onFormSubmit(item)}
                    >
                      <StyledTableCellSm>{item.name}</StyledTableCellSm>
                      <StyledTableCellSm>{item.id}</StyledTableCellSm>
                      <StyledTableCellSm>{item.favorite ? "Yes" : "-"}</StyledTableCellSm>
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
        <Grid item lg={4}>
          <Typography variant="h4" color="textPrimary">
            Recently Used
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCellSm>Name</StyledTableCellSm>
                  <StyledTableCellSm>ID</StyledTableCellSm>
                  <StyledTableCellSm>Favorite</StyledTableCellSm>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentICDs.length
                  ? recentICDs.map((item) => (
                    <StyledTableRowSm
                      key={item.id}
                      className={classes.pointer}
                      onClick={() => onFormSubmit(item)}
                    >
                      <StyledTableCellSm>{item.name}</StyledTableCellSm>
                      <StyledTableCellSm>{item.id}</StyledTableCellSm>
                      <StyledTableCellSm>{item.favorite ? "Yes" : "-"}</StyledTableCellSm>
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
        <Grid item lg={4}>
          <Typography variant="h4" color="textPrimary">
            Favorites
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCellSm>Name</StyledTableCellSm>
                  <StyledTableCellSm>ID</StyledTableCellSm>
                  <StyledTableCellSm>Favorite</StyledTableCellSm>
                </TableRow>
              </TableHead>
              <TableBody>
                {favoriteICDs.length
                  ? favoriteICDs.map((item) => (
                    <StyledTableRowSm
                      key={item.id}
                      className={classes.pointer}
                      onClick={() => onFormSubmit(item)}
                    >
                      <StyledTableCellSm>{item.name}</StyledTableCellSm>
                      <StyledTableCellSm>{item.id}</StyledTableCellSm>
                      <StyledTableCellSm>{item.favorite ? "Yes" : "-"}</StyledTableCellSm>
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
    </>
  );
};

Diagnoses.propTypes = {
  reloadData: PropTypes.func.isRequired,
};

export default Diagnoses;
