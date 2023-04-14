import { Activity } from './activity';

export interface ActivitiesResult {
  nextPageId?: string,
  activities: Activity[]
}
