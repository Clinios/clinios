import React, { useEffect, useState, useCallback } from "react";

import { Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";

import PatientService from "../../../../services/patient.service";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: 9,
  },
  tableContainer: {
    minWidth: 650,
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
      height: "50px",
    },
  },
}))(TableRow);

const BillingDetails = (props) => {
  const { patientId } = props;
  const classes = useStyles();
  const [billings, setBillings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBillings = useCallback(() => {
    PatientService.getBillings(patientId).then((res) => {
      setBillings(res.data);
      setIsLoading(false);
    });
  }, [patientId]);

  useEffect(() => {
    fetchBillings();
  }, [fetchBillings]);

  return (
    <TableContainer className={classes.tableContainer}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Transaction Type</StyledTableCell>
            <StyledTableCell>Encounter Title</StyledTableCell>
            <StyledTableCell>CPT Procedure</StyledTableCell>
            <StyledTableCell>Notes</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billings.length
            ? billings.map((item, index) => (
              <StyledTableRow key={`${item.dt}_${index}`}>
                <TableCell component="th" scope="item">
                  {moment(item.dt).format("MMM D YYYY")}
                </TableCell>
                <TableCell>{item.tran_type}</TableCell>
                <TableCell>{item.encounter_title}</TableCell>
                <TableCell>{item.cpt_procedure || ""}</TableCell>
                <TableCell>{item.note || ""}</TableCell>
              </StyledTableRow>
            ))
            : (
              <StyledTableRow>
                <TableCell colSpan={5}>
                  <Typography align="center" variant="body1">
                    {isLoading ? "Fetching Records" : "No Records Found..."}
                  </Typography>
                </TableCell>
              </StyledTableRow>
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BillingDetails;
