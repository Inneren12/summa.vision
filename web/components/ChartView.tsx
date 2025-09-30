
"use client";
import "../lib/register-renderers";
import { resolve } from "@core/charts/registry";
import type { ChartMeta, ChartData, ChartSeries } from "@core/models/Chart";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Treemap
} from "recharts";
import { useMemo } from "react";

function toFlatData(series: ChartSeries[]) {
  const xs = new Set<string | number>();
  for (const s of series) for (const p of s.points) xs.add(p.x);
  const flat: Record<string | number, any> = {};
  for (const x of xs) flat[x] = { x };
  for (const s of series) for (const p of s.points) { flat[p.x][s.id] = p.y; }
  return Object.values(flat);
}

export default function ChartView({ meta, data }: { meta: ChartMeta; data: ChartData }) {
  const { type, props } = resolve(meta.kind)(meta, data);
  const flat = useMemo(() => toFlatData((props.data as ChartData).series), [props.data]);

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
            {(props.data as ChartData).series.map((s) => (
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
            {(props.data as ChartData).series.map((s) => (
              <Bar key={s.id} dataKey={s.id} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "treemap") {
    const s0 = (props.data as ChartData).series[0];
    const tree = { name: "root", children: s0.points.map(p => ({ name: String(p.x), size: p.y })) };
    return (
      <div className="w-full h-[420px] card">
        <ResponsiveContainer width="100%" height="100%">
          {/* @ts-ignore */}
          <Treemap data={tree.children} dataKey="size" nameKey="name" />
        </ResponsiveContainer>
      </div>
    );
  }

  return <div>Unsupported chart type</div>;
}
