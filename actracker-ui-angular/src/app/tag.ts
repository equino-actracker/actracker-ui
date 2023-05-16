export interface Tag {
  id?: string;
  name?: string;
  metrics: Metric[];
}

export interface Metric {
  name: string;
  type: string
}
