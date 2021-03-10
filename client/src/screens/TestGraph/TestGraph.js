import React, {
  useRef,
} from "react";

import {
  Grid, makeStyles, Button, Typography,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import { mdiArrowLeftBold, mdiArrowRightBold } from "@mdi/js";
import Icon from "@mdi/react";
import {
  scaleLinear,
  scaleTime,
  timeFormat,
  extent,
} from "d3";

import { Graph } from './components';
import { AxisBottom } from "./AxisBottom";
import { AxisLeft } from "./Axisleft";
import { GraphTooltip } from "./GraphTooltip";
import { Marks } from "./LineChart";
import { useData } from "./useData";

const width = 1300;
const height = 500;
const margin = {
  top: 40, right: 30, bottom: 30, left: 90,
};


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
  const data = useData();
  const toolTipRef = useRef();
  const classes = useStyles();


  if (!data) {
    return <pre>...</pre>;
  }

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xValue = (d) => d.timestamp;

  const yValue = (d) => d.temperature;

  const xAxisTickFormat = timeFormat("%a");

  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();


  const handleMouseOver = () => {
    const tooltip = toolTipRef.current;
    tooltip.style.opacity = 1;
  };

  const handleMouseLeave = () => {
    const tooltip = toolTipRef.current;
    tooltip.style.opacity = 0;
  };

  return (
    <div className={classes.testGraphContainer}>
      <GraphTooltip
        handleMouseLeave={handleMouseLeave}
        handleMouseOver={handleMouseOver}
        toolTipRef={toolTipRef}
      />
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
