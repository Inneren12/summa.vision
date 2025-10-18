import { register } from "@core/charts/registry";
import { ChartKind } from "@core/models/Chart";
register(ChartKind.LINE, (meta, data) => ({ type: "line", props: { data } }));
register(ChartKind.BAR, (meta, data) => ({ type: "bar", props: { data } }));
register(ChartKind.TREEMAP, (meta, data) => ({ type: "treemap", props: { data } }));
