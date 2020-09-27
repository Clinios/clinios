import React, { useEffect, useState, useContext } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { AuthContext } from "../../../../providers/AuthProvider";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { setSuccess, setError } from "../../../../store/common/actions";
import MyActivityHistoryService from "../../../../services/myActivityHistory.service";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "40px 0px",
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
  paper: {
    padding: "5px",
  },
  tableContainer: {
    width: 500,
    marginTop: theme.spacing(1),
  },
  patientLink: {
    color: "#2979FF",
    cursor: "pointer",
  },
  placeholderText: {
    textAlign: "center",
    padding: "100px",
    fontWeight: "500",
    fontSize: "30px",
    opacity: "20%",
  },
  overFlowControl: {
    maxWidth: "130px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 13,
  },
}))(Tooltip);

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

export default function MyActivityHistory(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [userId, setUserId] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);

  const userContext = useContext(AuthContext);
  useEffect(() => {
    setUserId(userContext.user.id);
  }, [userContext]);

  useEffect(() => {
    if (userId != null) {
      MyActivityHistoryService.get(userId).then(
        (res) => {
          setActivityHistory(res.data);
          dispatch(setSuccess(res.data.message));
        },
        (error) => {
          dispatch(setError(error));
        }
      );
    }
  }, [userId]);

  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <Grid container direction="column" justify="center">
          <Typography
            component="h1"
            variant="h2"
            color="textPrimary"
            className={classes.title}
          >
            My Activity History
          </Typography>
          <Typography component="p" variant="body2" color="textPrimary">
            This page shows a user's activity history
          </Typography>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Time</StyledTableCell>
                  <StyledTableCell>Patient</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activityHistory.map((row, index) => (
                  <StyledTableRow key={index}>
                    <TableCell component="th" scope="row">
                      {moment(row.dt).format("lll")}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.patient}
                    </TableCell>
                    <TableCell className={classes.patientLink}>
                      {row.action}
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </div>
    </div>
  );
}
