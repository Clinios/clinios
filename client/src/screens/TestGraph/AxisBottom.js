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
    textAnchor: "middle",
  },
}));

export const AxisBottom = (
  {
    xScale, innerHeight,
    tickFormat, tickOffset = 3,
  },
) => {
  const classes = useStyles();
  return xScale.ticks().map((tickValue, i) => (
    <g
      key={tickValue}
      transform={`translate(${xScale(tickValue)},0)`}
    >
      {i === 0 && <line y1={innerHeight} />}
      <line y1={innerHeight} y2={innerHeight + 10} className={classes.tickline} />

      <text dy="1.3em" y={innerHeight + tickOffset} className={classes.tickLabel}>
        {tickFormat(tickValue)}
      </text>
    </g>
  ));
};
