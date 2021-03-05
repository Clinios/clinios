import React, { Component } from "react";

import {
  Typography, makeStyles,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import PropTypes from "prop-types";


const useStyles = makeStyles(() => ({
  tooltipContainer: {
    backgroundColor: "#fff",
    border: "solid",
    borderWidth: "1px",
    borderRadius: "5px",
    borderColor: "#aaa",
    padding: "10px",
    opacity: 0,
    transition: "all .2s",
    zIndex: "1000",
  },
}));


export const GraphTooltip = ({ toolTipRef, handleMouseLeave, handleMouseOver }) => {
  const classes = useStyles();
  return (
    <div
      ref={toolTipRef}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseOver}
      className={classes.tooltipContainer}
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
  );
};

GraphTooltip.propTypes = {
  toolTipRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Component) }),
  ]).isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
};
