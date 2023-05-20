export interface Tag {
  id?: string;
  name?: string;
  metrics: Metric[];
}

export interface Metric {
  id?: string;
  name: string;
  type: string
}
