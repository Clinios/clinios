import React, { useEffect, useState } from "react";

import { Grid, makeStyles, Button, Typography } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import { mdiArrowLeftBold, mdiArrowRightBold } from "@mdi/js";
import Icon from "@mdi/react";
import { useSnackbar } from "notistack";

import { Graph } from "./components";
import Tests from "../../services/tests.service";
import Patient from "../../services/patient.service";
import useAuth from "../../hooks/useAuth";

import { calculateFunctionalRange } from "../../utils/FunctionalRange";

const useStyles = makeStyles((theme) => ({
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
  const [cptName, setCptName] = useState("");
  const [functionalRange, setFunctionalRange] = useState({});
  const [labCpt, setLabCpt] = useState([]);
  const [graph, setGraph] = useState(null);
  const [testId, setTestId] = useState("");
  const [cptIdCount, setCptIdCount] = useState(0);
  const [range, setRange] = useState({});

  React.useEffect(() => {
    if (testId) {
      console.log(testId);
      Tests.getTestCptName(testId).then(
        (res) => {
          const data = res?.data?.data;
          setCptName(data);
        },
        () => {
          enqueueSnackbar(`Unable to fetch test by id ${testId}.`, {
            variant: "error",
          });
        }
      );
    }
  }, [testId]);

  React.useEffect(() => {
    Patient.getFunctionalRange(user.id).then(
      (res) => {
        const data = res?.data;
        setFunctionalRange(data);
      },
      () => {
        enqueueSnackbar("Unable to fetch Activity history.", {
          variant: "error",
        });
      }
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
      }
    );

    Tests.getTestGraph(user.id).then(
      (res) => {
        const data = res?.data;
        setGraph(data);
      },
      () => {
        enqueueSnackbar("Unable to fetch Activity history.", {
          variant: "error",
        });
      }
    );
  }, [user]);

  React.useEffect(() => {
    if (functionalRange?.functional_range && graph) {
      if (functionalRange?.functional_range[0]?.functional_range !== 0) {
        const data = calculateFunctionalRange(testId, functionalRange?.gender, functionalRange?.age);
        setRange(data);
      }
    }
  }, [functionalRange]);

  React.useEffect(() => {
    if (labCpt?.data?.length > 0) {
      console.log(labCpt.data[cptIdCount].id);
      setTestId(labCpt.data[cptIdCount].id);
    }
  }, [labCpt, cptIdCount]);

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
  console.log("labCpt", cptIdCount);
  return (
    <div className={classes.testGraphContainer}>
      <div className={classes.testGraph}>
        <Typography component="p" variant="body" color="textPrimary">
          Thyroid Stimulating Hormone {cptName[0]?.name && `( ${cptName[0].name} )`}
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
      </div>
      {graph?.data && <Graph data={graph.data} range={range} />}

      <Grid container xs={12} md={12} className={classes.gridMargin}>
        <Grid item xs={12} sm={6} className={classes.gridMargin} />
        <Grid item xs={12} sm={4} className={classes.gridMargin}>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
            // TODO: onClick={}
          >
            3 Months
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
            // TODO: onClick={}
          >
            6 Months
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
            // TODO: onClick={}
          >
            1 Years
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
            // TODO: onClick={}
          >
            2 Years
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
            // TODO: onClick={}
          >
            All
          </Button>
        </Grid>
        <Grid item xs={12} sm={2} className={classes.gridMargin}>
          <Typography component="p" variant="body2" color="success">
            --- Within functional range
          </Typography>
          <Typography component="p" variant="body2" color="error">
            --- Out of functional range
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default TestGraph;
