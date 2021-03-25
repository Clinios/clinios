import React, { useState, useEffect, useRef } from "react";

import {
  Grid, makeStyles, Button, Typography,
} from "@material-ui/core";
import { mdiArrowLeftBold, mdiArrowRightBold } from "@mdi/js";
import Icon from "@mdi/react";
import moment from "moment";
import { useSnackbar } from "notistack";

import useAuth from "../../hooks/useAuth";
import Patient from "../../services/patient.service";
import Tests from "../../services/tests.service";
import { calculateFunctionalRange } from "../../utils/FunctionalRange";
import { Graph } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "40px 0px",
  },
  gridMargin: {
    marginTop: "15px",
  },
  filterbutton: {
    marginRight: "5px",
  },
  testGraphContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    flexDirection: "column",
    marginTop: "30px",
  },
  testGraph: {
    alignSelf: "center",
    width: 1190,
  },
  graphArrowIconContainer: {
    width: "70px",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    marginBottom: "20px",
  },
  graphArrowIcon: {
    marginBottom: theme.spacing(1 / 2),
    marginLeft: theme.spacing(1),
    color: "#2979ffdb",
  },
}));

const TestGraph = () => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { user } = useAuth();
  const [graphSize, setGraphSize] = useState({ width: 0, heigh: 0 });
  const [cptName, setCptName] = useState("");
  const [functionalRange, setFunctionalRange] = useState({});
  const [labCpt, setLabCpt] = useState([]);
  const [graph, setGraph] = useState(null);
  const [graphFilterData, setGraphFilterData] = useState(null);
  const [testId, setTestId] = useState("");
  const [cptIdCount, setCptIdCount] = useState(0);
  const [range, setRange] = useState({});

  const ref = useRef(null);

  useEffect(() => {
    if (testId) {
      Tests.getTestCptName(testId).then(
        (res) => {
          const data = res?.data?.data;
          setCptName(data);
        },
        () => {
          enqueueSnackbar(`Unable to fetch test by id ${testId}.`, {
            variant: "error",
          });
        },
      );
    }
  }, [testId, enqueueSnackbar]);

  useEffect(() => {
    Patient.getFunctionalRange(user.id).then(
      (res) => {
        const data = res?.data;
        setFunctionalRange(data);
      },
      () => {
        enqueueSnackbar("Unable to fetch Activity history.", {
          variant: "error",
        });
      },
    );

    Tests.getLabCpt(user.id).then(
      (res) => {
        const data = res?.data;
        setLabCpt(data);
      },
      () => {
        enqueueSnackbar("Unable to fetch Activity history.", {
          variant: "error",
        });
      },
    );

    Tests.getTestGraph(user.id, testId).then(
      (res) => {
        const data = res?.data;
        setGraph(data);
        setGraphFilterData(data);
      },
      () => {
        enqueueSnackbar("Unable to fetch Activity history.", {
          variant: "error",
        });
      },
    );
  }, [user, testId, enqueueSnackbar]);

  useEffect(() => {
    if (functionalRange?.functional_range && graph) {
      if (functionalRange?.functional_range[0]?.functional_range !== 0) {
        const data = calculateFunctionalRange(testId, functionalRange?.gender, functionalRange?.age);
        setRange(data);
      }
    }
  }, [functionalRange, graph, testId]);

  useEffect(() => {
    if (labCpt?.data?.length > 0) {
      setTestId(labCpt.data[cptIdCount].id);
    }
  }, [labCpt, cptIdCount]);

  React.useEffect(() => {
    if (ref?.current) {
      setGraphSize({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      });
    }
  }, [ref, setGraphSize]);

  const previousCpt = () => {
    if (cptIdCount > 0) {
      setCptIdCount(cptIdCount - 1);
    }
  };
  const nextCpt = () => {
    if (labCpt?.data?.length > cptIdCount) {
      setCptIdCount(cptIdCount + 1);
    }
  };

  const filterDate = (filer) => {
    const endDate = moment();
    let startDate;
    if (filer === "month_6") {
      startDate = moment().subtract(6, "M");
    }
    if (filer === "month_3") {
      startDate = moment().subtract(3, "M");
    }
    if (filer === "year_1") {
      startDate = moment().subtract(12, "M");
    }
    if (filer === "year_2") {
      startDate = moment().subtract(24, "M");
    }

    const filterData = [];

    if (filer === "all") {
      setGraphFilterData(graph);
    } else {
      for (let i = 0; i < graph?.data.length; i += 1) {
        const compareDate = moment(graph?.data[i]?.lab_dt);
        const com = compareDate.isBetween(startDate, endDate);
        if (com) {
          filterData.push(graph?.data[i]);
        }
      }

      setGraphFilterData({ data: filterData });
    }
  };

  return (
    <div className={classes.root} ref={ref}>
      <Typography component="h1" variant="h2" color="textPrimary">
        {cptName[0]?.name && cptName[0].name}
      </Typography>
      <div className={classes.graphArrowIconContainer}>
        <Button
          disabled={cptIdCount <= 0}
          onClick={previousCpt}
          color="default"
          className={classes.graphArrowIcon}
        >
          <Icon path={mdiArrowLeftBold} size={1.3} horizontal vertical rotate={180} />
        </Button>
        <Button
          disabled={cptIdCount >= labCpt?.data?.length}
          onClick={nextCpt}
          color="default"
          className={classes.graphArrowIcon}
          target="_blank"
        >
          <Icon path={mdiArrowRightBold} size={1.3} horizontal vertical rotate={180} />
        </Button>
      </div>

      {graphSize.width && graph?.data && (
        <Graph data={graphFilterData?.data} range={range} graphSize={graphSize} />
      )}

      <Grid container xs={12} md={12} className={classes.gridMargin}>
        <Grid item xs={12} sm={6} className={classes.gridMargin} />
        <Grid item xs={12} sm={4} className={classes.gridMargin}>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
            onClick={() => filterDate("month_3")}
          >
            3 Months
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
            onClick={() => filterDate("month_6")}
          >
            6 Months
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
            onClick={() => filterDate("year_1")}
          >
            1 Years
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
            onClick={() => filterDate("year_2")}
          >
            2 Years
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
            onClick={() => filterDate("all")}
          >
            All
          </Button>
        </Grid>
        <Grid item xs={12} sm={2} className={classes.gridMargin}>
          <Typography component="p" variant="body2" color="success">
            --- Within range
          </Typography>
          <Typography component="p" variant="body2" color="error">
            --- Out of range
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default TestGraph;
