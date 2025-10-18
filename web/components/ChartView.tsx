"use client";
import "../lib/register-renderers";

import { resolve } from "@core/charts/registry";
import type { ChartData, ChartMeta, ChartSeries } from "@core/models/Chart";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";

type FlatDataPoint = {
  x: string | number;
} & Record<string, number | string>;

function toFlatData(series: ChartSeries[]): FlatDataPoint[] {
  const flat = new Map<string | number, FlatDataPoint>();

  for (const s of series) {
    for (const p of s.points) {
      const existing = flat.get(p.x);
      if (existing) {
        existing[s.id] = p.y;
      } else {
        flat.set(p.x, { x: p.x, [s.id]: p.y });
      }
    }
  }

  return Array.from(flat.values());
}

type TreemapNode = { name: string; size: number };

export default function ChartView({ meta, data }: { meta: ChartMeta; data: ChartData }) {
  const renderer = resolve(meta.kind);
  const { type, props } = renderer(meta, data);
  const chartData = props.data as ChartData;
  const series: ChartSeries[] = chartData.series;
  const flat = useMemo(() => toFlatData(series), [series]);

  if (type === "line") {
    return (
      <div className="w-full h-[420px] card">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={flat}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            {series.map((s: ChartSeries) => (
              <Line key={s.id} type="monotone" dataKey={s.id} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "bar") {
    return (
      <div className="w-full h-[420px] card">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={flat}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            {series.map((s: ChartSeries) => (
              <Bar key={s.id} dataKey={s.id} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "treemap") {
    const s0 = series[0];
    const tree: TreemapNode[] = s0.points.map((p) => ({ name: String(p.x), size: p.y }));
    return (
      <div className="w-full h-[420px] card">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap data={tree} dataKey="size" nameKey="name" />
        </ResponsiveContainer>
      </div>
    );
  }

  return <div>Unsupported chart type</div>;
}
