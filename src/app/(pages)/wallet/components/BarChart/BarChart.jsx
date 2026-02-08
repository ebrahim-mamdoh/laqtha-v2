"use client";

/**
 * BarChart.jsx
 * 
 * OPTIMIZED: Single dynamic import instead of 7 separate ones.
 * 
 * Before: Each Recharts component (BarChart, Bar, XAxis, etc.) was
 * dynamically imported separately, causing 7 parallel chunk requests.
 * 
 * After: All Recharts code is in BarChartInner.jsx, loaded as one chunk.
 * 
 * Performance benefit:
 * - Reduces network requests from 7 to 1
 * - Eliminates waterfall loading
 * - Single chunk is more cache-efficient
 */

import dynamic from "next/dynamic";

const BarChartInner = dynamic(() => import("./BarChartInner"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      Loading chart…
    </div>
  ),
});

export default function BarChart({ data }) {
  return <BarChartInner data={data} />;
}