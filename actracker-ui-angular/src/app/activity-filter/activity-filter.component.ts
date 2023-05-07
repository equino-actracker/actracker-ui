import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Tag } from '../tag';
import { ActivityFilter } from '../activityFilter';

@Component({
  selector: 'app-activity-filter',
  templateUrl: './activity-filter.component.html',
  styleUrls: ['./activity-filter.component.css']
})
export class ActivityFilterComponent implements OnInit {

  @Input()
  activityFilter!: ActivityFilter;

  @Output()
  public onFiltersApplied: EventEmitter<ActivityFilter> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  toEndOfDay(date?: string): Date | undefined {
    return this.toDateWithTime(23,59,59,999,date);
  }

  toStartOfDay(date?: string): Date | undefined {
    return this.toDateWithTime(0,0,0,0,date);
  }

  private toDateWithTime(
                          hour: number,
                          minute: number,
                          second: number,
                          millis: number,
                          date?: string,
  ): Date | undefined {

    if(!date) {
      return undefined;
    }
    let dateEndOfDay = new Date(date);
    dateEndOfDay.setHours(hour,minute,second,millis);
    return dateEndOfDay;
  }

  addNewTag(tag: Tag): void {
    this.activityFilter.tags.unshift(tag);
  }

  deleteTag(tag: Tag): void {
    this.activityFilter.tags = this.activityFilter.tags.filter(t => t !== tag)
  }

  apply(): void {
    this.onFiltersApplied.emit(this.activityFilter);
  }

}
