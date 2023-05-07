import { Tag } from './tag';

export interface ActivityFilter {
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
  tags: Tag[]
}
