import React, { useState, useEffect, useCallback } from "react";

import {
  Button, Grid, Typography, Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import { useDispatch } from "react-redux";

import PatientService from "../../../../services/patient.service";
import { setError, setSuccess } from "../../../../store/common/actions";

const HandoutsForm = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { onClose, reloadData, patientId } = props;
  const [allHandouts, setAllHandouts] = useState([]);
  const [selectedHandout, setSelectedHandout] = useState(null);

  const fetchAllHandouts = useCallback(() => {
    PatientService.getAllHandouts().then((res) => {
      setAllHandouts(res.data);
    });
  }, []);

  useEffect(() => {
    fetchAllHandouts();
  }, [fetchAllHandouts]);

  const createPatientHandoutHandler = () => {
    if (selectedHandout) {
      // we don't have the selected row id, so calculating the row id
      const userSelection = allHandouts.filter((x) => x.filename === selectedHandout);
      const reqBody = {
        data: {
          handout_id: userSelection[0].id,
        },
      };
      PatientService.createPatientHandout(patientId, reqBody)
        .then((response) => {
          dispatch(setSuccess(`${response.data.message}`));
          reloadData();
          onClose();
        })
        .catch((error) => {
          const resMessage = (error.response
              && error.response.data
              && error.response.data.message)
            || error.message
            || error.toString();
          const severity = "error";
          dispatch(
            setError({
              severity,
              message: resMessage,
            }),
          );
        });
    } else {
      dispatch(
        setError({
          severity: "error",
          message: "Checkbox selection is required",
        }),
      );
    }
  };

  const onCheckboxClick = (e) => {
    const { name } = e.target;
    setSelectedHandout(name);
  };

  return (
    <>
      <Typography variant="h3" color="textSecondary" gutterBottom>
        Patient Handouts
      </Typography>

      <TableContainer className={classes.tableContainer}>
        <Table size="small" className={classes.table}>
          <TableBody>
            {allHandouts.map((row, index) => (
              <TableRow key={`${row.created}_${index}`}>
                <TableCell padding="checkbox">
                  <Checkbox
                    name={row.filename}
                    checked={selectedHandout === row.filename}
                    onChange={onCheckboxClick}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {moment(row.created).format("MMM D YYYY")}
                </TableCell>
                <TableCell>{row.filename}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid
        className={classes.actionContainer}
        container
        justify="space-between"
      >
        <Button
          variant="outlined"
          onClick={() => createPatientHandoutHandler()}
          type="submit"
        >
          Save
        </Button>
        <Button variant="outlined" onClick={() => onClose()}>
          Cancel
        </Button>
      </Grid>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  inputRow: {
    margin: theme.spacing(3, 0),
  },
  processPaymentButton: {
    margin: theme.spacing(3, 0),
  },
  amountContainer: {
    marginLeft: "0px !important",
  },
  formInput: {
    marginBottom: theme.spacing(1),
  },
  actionContainer: {
    marginTop: theme.spacing(4),
  },
}));

export default HandoutsForm;
