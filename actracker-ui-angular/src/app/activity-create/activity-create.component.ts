import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ConversionService } from '../conversion.service';
import { ActivityService } from '../activity.service';

import { Activity } from '../activity';
import { Tag } from '../tag';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.css']
})
export class ActivityCreateComponent implements OnInit {

  @Input()
  activity!: Activity;

  @Output()
  onActivityCreated: EventEmitter<Activity> = new EventEmitter();

  constructor(
    public conversionService: ConversionService,
    private activityService: ActivityService,
  ) { }

  ngOnInit(): void {
  }

  create() {
    this.activityService.createActivity(this.activity)
      .subscribe(activity => {
        this.onActivityCreated.emit(activity);
      });
  }

  addNewTag(tag: Tag): void {
    this.activity.tags.unshift(tag);
  }

  deleteTag(tag: Tag): void {
    this.activity.tags = this.activity.tags.filter(t => t !== tag)
  }

}
