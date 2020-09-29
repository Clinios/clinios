import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { Reports } from "./components";
import ReportFinanceService from "./../../../../services/reportFinance.service";
import { AuthConsumer } from "../../../../providers/AuthProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "20px 0px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(1),
  },
  formElments: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "500px",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    marginTop: "20px",
    maxWidth: "440px",
  },
  customSelect: {
    width: "200px",
  },
  type: {
    marginTop: "20px",
  },
  paper: {
    maxWidth: "456px",
  },
  textField: {
    width: "200px",
  },
  amount: {
    marginTop: "18px",
  },
  datePicker: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

export default function ReportFinance(props) {
  const classes = useStyles();
  const [dateFrom, setDateFrom] = useState(
    moment().subtract(3, "months").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [reports, setReports] = useState([]);

  const fetchReportFinance = () => {
    ReportFinanceService.getAll(dateFrom, dateTo).then((res) => {
      setReports(res.data);
    });
  };

  useEffect(() => {
    fetchReportFinance();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChangeFrom = (event) => {
    setDateFrom(event.target.value);
  };

  const handleDateChangeTo = (event) => {
    setDateTo(event.target.value);
  };

  const handleOnEnterClick = () => {
    ReportFinanceService.getAll(dateFrom, dateTo).then((res) => {
      setReports(res.data);
    });
  };

  return (
    <AuthConsumer>
      {({ user }) => (
        <div className={classes.root}>
          <div className={classes.paper}>
            <CssBaseline />
            <Container maxWidth={false} className={classes.root}>
              <div className={classes.header}>
                <Typography component="h1" variant="h2" color="textPrimary">
                  Report Finance
                </Typography>
              </div>
              <Typography component="p" variant="body2" color="textPrimary">
                This page is used to search accounting records
              </Typography>
              <Grid container direction="column" justify="center">
                <div className={classes.datePicker}>
                  <Grid container>
                    <Grid item xs={12} sm={6} spacing={2}>
                      <TextField
                        variant="outlined"
                        id="date"
                        label="Date From"
                        value={dateFrom}
                        className={classes.textField}
                        onChange={handleDateChangeFrom}
                        type="date"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        id="date"
                        label="Date To"
                        type="date"
                        value={dateTo}
                        className={classes.textField}
                        onChange={handleDateChangeTo}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                component="span"
                onClick={() => handleOnEnterClick()}
              >
                Enter
              </Button>
              <Grid container justify="center" spacing={2}>
                <Grid item md={12} xs={12}>
                  <Reports reports={reports} />
                </Grid>

                {/*
                <Grid item md={12} xs={12}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h4" gutterBottom>
                        <Video url="https://www.youtube.com/watch?v=ysz5S6PUM-U" />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                */}
              </Grid>
            </Container>
          </div>
        </div>
      )}
    </AuthConsumer>
  );
}
