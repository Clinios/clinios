import React from "react";
import moment from "moment";
import { LineChart, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts";

import ReferenceLabel from "./ReferenceLabel";

export default function Graph({ data, range }) {
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
      getDerivedStateFromProps={(po) => {
        console.log("po", po);
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={(v) => moment(v?.lab_dt).format("YYYY")} />
      <YAxis
        type="number"
        domain={[range?.low - 5, range?.high + 5]}
        interval="0.5"
        ticks={[
          range?.high + 1,
          range?.high + 0.5,
          range?.high,
          range?.low,
          range?.low - 0.5,
          range?.low - 1,
        ]}
        tick={{ stroke: "grey", strokeWidth: 0.5 }}
        tickCount={5}
      />
      <Tooltip />
      <Legend />
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
}
