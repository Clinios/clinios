import React from "react";

export const AxisLeft = ({ yScale, innerWidth, tickOffset = 3 }) => yScale.ticks().map((tickValue, i) => (
  <g className="tick" transform={`translate(0,${yScale(tickValue)})`}>
    {i === 0 && <line x2={innerWidth} />}
    <line x1={0} x2={5} />
    <text
      key={tickValue}
      style={{ textAnchor: "end" }}
      x={-tickOffset}
      dy=".30em"
    >
      {tickValue}
    </text>
  </g>
));
