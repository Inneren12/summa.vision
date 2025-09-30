
import type { ChartData, ChartMeta } from "../models/Chart";

export type ChartRenderer = (meta: ChartMeta, data: ChartData) => { type: string; props: Record<string, unknown> };

const registryMap = new Map<number, ChartRenderer>();

export function register(kind: number, renderer: ChartRenderer) { registryMap.set(kind, renderer); }
export function resolve(kind: number): ChartRenderer {
  const r = registryMap.get(kind);
  if (!r) throw new Error(`Renderer missing for kind ${kind}`);
  return r;
}
