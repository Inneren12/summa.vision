
export type SectionSlug = string;

export enum ChartKind { LINE, BAR, AREA, PIE, TREEMAP, SANKEY }

export interface ChartPoint {
  x: number | string;
  y: number;
  [k: string]: number | string | null | undefined;
}

export interface ChartSeries { id: string; points: ChartPoint[] }

export interface ChartData { series: ChartSeries[]; unit?: string; percent?: boolean }

export interface ChartMeta {
  slug: string;
  title: string;
  subtitle?: string;
  section: SectionSlug;
  tags?: string[];
  publishedAt: string; // ISO
  kind: ChartKind;
  sources?: string[];
  coverUrl?: string;
}
