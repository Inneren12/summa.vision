import { register } from "@core/charts/registry";
import type { ChartData, ChartMeta } from "@core/models/Chart";
import { ChartKind } from "@core/models/Chart";

register(ChartKind.LINE, (meta: ChartMeta, data: ChartData) => ({ type: "line", props: { data } }));
register(ChartKind.BAR, (meta: ChartMeta, data: ChartData) => ({ type: "bar", props: { data } }));
register(
  ChartKind.TREEMAP,
  (meta: ChartMeta, data: ChartData) => ({ type: "treemap", props: { data } }),
);
