import { Share } from './share';

export interface Tag {
  id?: string;
  name?: string;
  metrics: Metric[];
  shares: Share[];
}

export interface Metric {
  id?: string;
  name: string;
  type: string
}
