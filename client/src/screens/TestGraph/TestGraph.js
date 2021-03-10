import React from "react";

import {
  Grid, makeStyles, Button, Typography,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import { mdiArrowLeftBold, mdiArrowRightBold } from "@mdi/js";
import Icon from "@mdi/react";

import { Graph } from "./components";

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
  const classes = useStyles();

  return (
    <div className={classes.testGraphContainer}>
      <div className={classes.testGraph}>
        <Typography component="p" variant="body" color="textPrimary">
          Thyroid Stimulating Hormone (TSH)
        </Typography>
        <div className={classes.graphArrowIconContainer}>
          <Link
            href="/"
            className={classes.graphArrowIcon}
            target="_blank"
          >
            <Icon
              path={mdiArrowLeftBold}
              size={1.3}
              horizontal
              vertical
              rotate={180}
            />
          </Link>
          <Link
            href="/"
            className={classes.graphArrowIcon}
            target="_blank"
          >
            <Icon
              path={mdiArrowRightBold}
              size={1.3}
              horizontal
              vertical
              rotate={180}
            />
          </Link>
        </div>
      </div>
      <Graph />
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
