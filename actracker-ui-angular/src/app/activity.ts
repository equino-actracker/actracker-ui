import { Tag } from './tag';

export interface Activity {
  id?: string;
  startTime?: Date;
  endTime?: Date;
  comment?: string;
  tags: Tag[]
}
