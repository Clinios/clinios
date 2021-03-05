import React from "react";

import {
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  tickline: {
    stroke: "#c0c0bb",
  },
  tickLabel: {
    fill: "#635f5d",
    textAnchor: "end",
  },
}));

export const AxisLeft = ({ yScale, innerWidth, tickOffset = 3 }) => {
  const classes = useStyles();
  return yScale.ticks().map((tickValue, i) => (
    <g className="tick" transform={`translate(0,${yScale(tickValue)})`}>
      {i === 0 && <line x2={innerWidth} />}
      <line x1={0} x2={5} className={classes.tickline} />
      <text
        key={tickValue}
        style={{ textAnchor: "end" }}
        x={-tickOffset}
        dy=".30em"
        className={classes.tickLabel}
      >
        {tickValue}
      </text>
    </g>
  ));
};
