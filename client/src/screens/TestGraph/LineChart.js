import React, { Component } from "react";

import {
  makeStyles,
} from "@material-ui/core";
import { line, curveNatural } from "d3";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  path: {
    stroke: "#137b80",
    strokeWidth: "1",
    strokeLinejoin: "round",
    strokeLinecap: "round",
  },
  circle: {
    fill: "#fff",
    stroke: "#137b80",
  },
}));

export const Marks = ({
  data,
  xScale,
  yScale,
  xValue,
  yValue,
  tooltipFormat,
  circleRadius,
  toolTipRef,
}) => {
  const classes = useStyles();

  const handleMouseMove = (event) => {
    const tooltip = toolTipRef.current;
    tooltip.style.position = "absolute";
    tooltip.style.left = `${event.pageX - 10}px`;
    tooltip.style.top = `${event.pageY - 170}px`;
  };

  const handleMouseOver = () => {
    const tooltip = toolTipRef.current;
    tooltip.style.opacity = 1;
  };

  const handleMouseLeave = () => {
    const tooltip = toolTipRef.current;
    tooltip.style.opacity = 0;
  };


  return (
    <g>
      <path
        fill="none"
        className={classes.path}
        d={
          line()
            .x((d) => xScale(xValue(d)))
            .y((d) => yScale(yValue(d)))
            .curve(curveNatural)(data)
        }
      />
      {data.map((d) => (
        <g
          onMouseOver={handleMouseOver}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <text
            x={xScale(xValue(d))}
            y={yScale(yValue(d))}
            dy="-1.5em"
            dx="-.90em"
            fontSize=".7em"
          >
            {tooltipFormat(yValue(d))}
          </text>
          <circle
            cx={xScale(xValue(d))}
            cy={yScale(yValue(d))}
            r={circleRadius}
            className={classes.circle}
          />
        </g>
      ))}
    </g>
  );
};


Marks.propTypes = {
  data: PropTypes.arrayOf.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  xValue: PropTypes.func.isRequired,
  yValue: PropTypes.func.isRequired,
  circleRadius: PropTypes.number.isRequired,
  tooltipFormat: PropTypes.func.isRequired,
  toolTipRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Component) }),
  ]).isRequired,
};
