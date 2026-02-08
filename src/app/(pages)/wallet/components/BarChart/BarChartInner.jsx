"use client";

/**
 * BarChartInner.jsx
 * 
 * Contains all Recharts imports in a single file.
 * This is dynamically imported by BarChart.jsx to:
 * - Reduce from 7 separate chunk requests to 1
 * - Eliminate waterfall loading of Recharts components
 * - Keep the heavy library (~200KB) in a single lazy-loaded chunk
 */

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./barchart.module.css";

export default function BarChartInner({ data }) {
  return (
    <div className={styles.barWrap}>
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
          />
          <XAxis dataKey="date" tick={{ fill: "#FFFFFF", fontSize: 12 }} />
          <YAxis tick={{ fill: "#FFFFFF", fontSize: 12 }} />
          <Tooltip />
          <Bar
            dataKey="topup"
            fill="#F901C9"
            barSize={30}
            radius={[25, 25, 8, 8]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="pay"
            fill="#094EFD"
            barSize={30}
            radius={[25, 25, 4, 4]}
            isAnimationActive={false}
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
