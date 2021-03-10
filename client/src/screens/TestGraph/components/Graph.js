import React from "react";

import {
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import ReferenceLabel from "./ReferenceLabel";

// TODO:: Dummy data which will be removed soon.
const data = [
  {
    name: "2012",
    fr: 5.5,
    uv: 2500,
    pv: 4000,
    amt: 2500,
  },
  {
    name: "2013",
    fr: 5.5,
    uv: 2500,
    pv: 4000,
    amt: 2500,
  },
  {
    name: "2014",
    fr: 5.5,
    uv: 2500,
    pv: 4000,
    amt: 2500,
  },
  {
    name: "2015",
    fr: 5.5,
    uv: 2500,
    pv: 4000,
    amt: 2500,
  },
  {
    name: "2016",
    fr: 5.5,
    uv: 2500,
    pv: 4000,
    amt: 2500,
  },
  {
    name: "2017",
    fr: 5.5,
    uv: 2500,
    pv: 4000,
    amt: 2500,
  },
  {
    name: "2018",
    fr: 5.5,
    uv: 2500,
    pv: 4000,
    amt: 2500,
  },
];

export default function Graph() {
  return (
    <LineChart
      width={800}
      height={500}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis
        type="number"
        domain={[3, 8]}
        interval="0.5"
        ticks={[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7]}
        tick={{ stroke: "grey", strokeWidth: 0.5 }}
        tickCount={5}
      />
      <Tooltip />
      <Legend />
      <ReferenceLine
        y={5.6}
        label={<ReferenceLabel value="Conventional range" fill="#477fc9" />}
        stroke="#477fc9"
      />
      <ReferenceLine
        y={5.5}
        label={<ReferenceLabel value="Functional range" fill="#477fc9" />}
        stroke="#477fc9"
      />
      <ReferenceLine
        y={5.0}
        label={<ReferenceLabel value="Functional range" fill="#477fc9" />}
        stroke="#477fc9"
      />
      <ReferenceLine
        y={4.8}
        label={<ReferenceLabel value="Conventional range" fill="#477fc9" />}
        stroke="#477fc9"
      />
    </LineChart>
  );
}
