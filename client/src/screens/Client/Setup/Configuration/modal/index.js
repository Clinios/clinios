import Modal from "@material-ui/core/Modal";
import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles, withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import moment from "moment";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey,
    color: theme.palette.grey,
    fontSize: "12px",
    fontWeight: 700,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    fontSize: 14,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "& th": {
      fontSize: 12,
    },
    "& td": {
      fontSize: 12,
    },
  },
}))(TableRow);

export default function ConfigModal({ modal, setModal }) {
  const classes = useStyles();
  console.log(modal);
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={modal.isOpen}
      onClose={() => setModal({ ...modal, isOpen: false })}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modal.isOpen}>
        <div className={classes.paper}>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              component="h1"
              variant="h2"
              color="textPrimary"
              className={classes.title}
            >
              Configuration History
            </Typography>
            <div>
              <Button
                size="small"
                type="button"
                variant="contained"
                color="secondary"
                onClick={() => setModal({ ...modal, isOpen: false })}
              >
                Cancel
              </Button>
            </div>
          </div>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Appointment Type</StyledTableCell>
                  <StyledTableCell>Portal Name</StyledTableCell>
                  <StyledTableCell>Minutes</StyledTableCell>
                  <StyledTableCell>Patient Schedule</StyledTableCell>
                  <StyledTableCell>Order</StyledTableCell>

                  <StyledTableCell align="center">Note</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Created</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modal.data.map((result, index) => (
                  <StyledTableRow key={index}>
                    <TableCell component="th" scope="row">
                      -
                    </TableCell>

                    <TableCell>
                      {`app.clinios.com/signup?c=${modal?.currentUser?.id}`}
                    </TableCell>
                    <TableCell>
                      {`${result.calendar_start_time} ~ ${result.calendar_end_time}`}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{result.concierge_lab_ordering}</TableCell>
                    <TableCell>{result?.note || `-`}</TableCell>
                    <TableCell>{result?.status || `-`}</TableCell>
                    <TableCell component="th" scope="row">
                      {moment(result.dt).format("lll")}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Fade>
    </Modal>
  );
}
