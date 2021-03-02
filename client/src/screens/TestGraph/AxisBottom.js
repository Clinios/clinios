import React from "react";

export const AxisBottom = (
  {
    xScale, innerHeight,
    tickFormat, tickOffset = 3,
  },
) => xScale.ticks().map((tickValue, i) => (
  <g
    className="tick"
    key={tickValue}
    transform={`translate(${xScale(tickValue)},0)`}
  >
    {i === 0 && <line y1={innerHeight} />}
    <line y1={innerHeight} y2={innerHeight + 10} />

    <text style={{ textAnchor: "middle" }} dy="1.3em" y={innerHeight + tickOffset}>
      {tickFormat(tickValue)}
    </text>
  </g>
));
