
import type { ChartData, ChartSeries } from "../models/Chart";

export function normalizeData(data: ChartData): ChartData {
  const sorted: ChartSeries[] = data.series.map(s => ({
    id: s.id,
    points: [...s.points]
      .filter(p => Number.isFinite(p.y))
      .sort((a, b) => {
        const ax = typeof a.x === "number" ? a.x : Number.NaN;
        const bx = typeof b.x === "number" ? b.x : Number.NaN;
        if (Number.isNaN(ax) || Number.isNaN(bx)) return 0;
        return ax - bx;
      })
  }));
  return { ...data, series: sorted };
}
