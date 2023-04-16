import { Tag } from './tag';

export interface Activity {
  id?: string;
  title?: string;
  startTime?: Date;
  endTime?: Date;
  comment?: string;
  tags: Tag[]
}
