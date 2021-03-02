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


import { AxisBottom } from "./AxisBottom";
import { AxisLeft } from "./Axisleft";
// import { LeftArrow } from "./LeftArrow";
import { Marks } from "./LineChart";
// import { RightArrow } from "./RightArrow";
import { useData } from "./useData";

import "./TestGraph.css";

const width = 1300;
const height = 500;
const margin = {
  top: 40, right: 30, bottom: 30, left: 90,
};


const useStyles = makeStyles(() => ({
  gridMargin: {
    marginTop: "15px",
  },
  filterbutton: {
    marginRight: "5px",
  },
}));

const TestGraph = () => {
  const data = useData();
  const toolTipRef = useRef();
  const classes = useStyles();


  if (!data) {
    return <pre>Loading...</pre>;
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
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      flexDirection: "column",
      marginTop: "30px",
    }}
    >
      <div
        ref={toolTipRef}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseOver}
        style={{
          backgroundColor: "#fff",
          border: "solid",
          borderWidth: "1px",
          borderRadius: "5px",
          borderColor: "#aaa",
          padding: "10px",
          opacity: 0,
          transition: "all .2s",
          zIndex: "1000",
        }}
        className="toolti"
      >
        <Typography component="p" variant="body2" color="textPrimary">
          Lab Date: June 15, 2019 8:00AM
        </Typography>
        <Typography component="p" variant="body2" color="textPrimary">
          File: Something.txt
        </Typography>
        <Typography component="p" variant="body2" color="textPrimary">
          Value: 6
        </Typography>
        <Link
          href="/"
          target="_blank"
        >
          <Typography component="p" variant="body2" color="textPrimary">
            Link to Original File
          </Typography>
        </Link>

      </div>
      <div style={{
        alignSelf: "center",
        width: 1190,
      }}
      >
        <Typography component="p" variant="body" color="textPrimary">
          Thyroid Stimulating Hormone (TSH)
        </Typography>
        <div style={{
          width: "70px",
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
        >
          <Link
            href="/"
            className={classes.patientIcon}
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
            className={classes.patientIcon}
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

      <svg width={width} height={height}>
        <g
          transform={`translate(${margin.left},${margin.top})`}
        >
          <AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickFormat={xAxisTickFormat}
            tickOffset={7}
          />
          <AxisLeft
            yScale={yScale}
            innerWidth={innerWidth}
            tickOffset={7}
          />
          <Marks
            data={data}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            tooltipFormat={xAxisTickFormat}
            circleRadius={3}
            toolTipRef={toolTipRef}
          />
        </g>
      </svg>

      <Grid container xs={12} md={12} className={classes.gridMargin}>
        <Grid item xs={12} sm={6} className={classes.gridMargin} />
        <Grid item xs={12} sm={4} className={classes.gridMargin}>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
          // onClick={}
          >
            3 Months
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
          // onClick={}
          >
            6 Months
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
          // onClick={}
          >
            1 Years
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
          // onClick={}
          >
            2 Years
          </Button>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            color="default"
            className={classes.filterbutton}
          // onClick={}
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
