// FILE: components/DonutChart.jsx
"use client";

/**
 * DonutChart.jsx
 * 
 * OPTIMIZED: Disabled animations to reduce main thread blocking.
 * 
 * Before: isAnimationActive={true} with 900ms duration
 * After: isAnimationActive={false}
 * 
 * Performance benefit:
 * - Eliminates 900ms animation delay per chart (3 charts = 2.7s saved)
 * - Reduces main thread blocking during render
 * - Chart appears instantly instead of animating in
 * 
 * Visual impact: Charts render immediately without fade-in animation.
 * The data is still displayed identically.
 */

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./DonutChart.module.css";

const COLORS = ["#094EFD", "#F901C9", "#3ad0ff"];

export default function DonutChart({ data, centerLabel }) {
  return (
    <div className={styles.donutWrap}>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={48}
            outerRadius={70}
            paddingAngle={4}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {centerLabel && <div className={styles.centerLabel}>{centerLabel}</div>}
    </div>
  );
}