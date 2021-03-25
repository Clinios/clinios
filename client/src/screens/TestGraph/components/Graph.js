import React from "react";

import { makeStyles } from "@material-ui/core";
import moment from "moment";
import PropTypes from "prop-types";
import {
  LineChart, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Line,
} from "recharts";

import ReferenceLabel from "./ReferenceLabel";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "2px solid #333",
    padding: theme.spacing(1),
    background: "#fff",
    borderRadius: "10px",
  },
}));

const CustomTooltip = ({ payload }) => {
  const classes = useStyles();

  if (payload && payload.length) {
    return (
      <div className={classes.root}>
        <p className="label">
          {
            `Date : ${moment(payload[0]?.payload?.lab_dt).format("MMMM Do YYYY, h:mm A")}`
          }
        </p>
        <p className="label">{`File : ${payload[0]?.payload?.filename}`}</p>
        <p className="label">{`Value : ${payload[0]?.payload?.value}`}</p>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  payload: PropTypes.instanceOf(Array).isRequired,
};

const Graph = ({ data, range, graphSize }) => {
  const middele = (range?.low + range?.high) / 2 + range?.low;
  return (
    <LineChart
      width={graphSize?.width - 20}
      height={600}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={(v) => moment(v?.lab_dt).format("YYYY")} />
      <YAxis
        type="number"
        domain={[range?.low, range?.high]}
        interval="0"
        ticks={[
          range?.high + 2,
          range?.high + 1.5,
          range?.high + 1,
          range?.high + 0.5,
          range?.high,
          middele,
          range?.low,
          range?.low - 0.5,
          range?.low - 1,
          range?.low - 1.5,
          range?.low - 2,
        ]}
        tick={{ stroke: "grey", strokeWidth: 0.5 }}
        tickCount={5}
      />
      <Tooltip content={<CustomTooltip />} />
      <ReferenceLine
        y={range?.high + 0.5}
        label={<ReferenceLabel value="Conventional range" fill="#477fc9" />}
        stroke="#477fc9"
      />
      <ReferenceLine
        y={range?.high}
        label={<ReferenceLabel value="Functional range" fill="#477fc9" />}
        stroke="#477fc9"
      />
      <ReferenceLine
        y={range?.low}
        label={<ReferenceLabel value="Functional range" fill="#477fc9" />}
        stroke="#477fc9"
      />
      <ReferenceLine
        y={range?.low - 0.5}
        label={<ReferenceLabel value="Conventional range" fill="#477fc9" />}
        stroke="#477fc9"
      />
      <Line strokeWidth={2} type="monotone" dataKey={(v) => v.value} stroke="#477fc9" />
    </LineChart>
  );
};

Graph.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    lab_dt: PropTypes.string,
    filename: PropTypes.string,
    value: PropTypes.number,
  }).isRequired,
  range: PropTypes.shape({
    high: PropTypes.number,
    low: PropTypes.number,
  }).isRequired,
  graphSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }).isRequired,
};


export default Graph;
