'use client';
import dynamic from "next/dynamic";

// نعمل dynamic import لكل كومبوننت من recharts
const ReBarChart = dynamic(() =>
  import("recharts").then((mod) => mod.BarChart),
  { ssr: false, loading: () => <div style={{ height: 200 }}>Loading chart…</div> }
);

const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
import styles from './barchart.module.css';


export default function BarChart({ data }) {
  return (
    <div className={styles.barWrap}>
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fill: '#FFFFFF', fontSize: 12 }} />
          <YAxis tick={{ fill: '#FFFFFF', fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="topup" fill='#F901C9' barSize={30} radius={[25, 25, 8, 8]} />
          <Bar dataKey="pay" fill='#094EFD' barSize={30} radius={[25, 25, 4, 4]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}