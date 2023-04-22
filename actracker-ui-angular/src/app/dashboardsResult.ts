import { Dashboard } from './dashboard';

export interface DashboardsResult {
  nextPageId?: string,
  dashboards: Dashboard[]
}
