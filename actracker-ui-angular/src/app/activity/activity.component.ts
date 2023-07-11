import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ActivityService } from '../activity.service';
import { ConversionService } from '../conversion.service';

import { Activity, MetricValue } from '../activity';
import { Tag } from '../tag';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  @Input()
  activity!: Activity;

  @Input()
  renameMode?: boolean;
  @Input()
  changeStartTimeMode?: boolean;
  @Input()
  changeEndTimeMode?: boolean;
  @Input()
  updateCommentMode?: boolean;

  @Input()
  newTitle?: string;
  newStartTime?: Date;
  newEndTime?: Date;
  newComment?: string;

  @Input()
  editMode?: boolean; // DELETE

  // DELETE
  @Output()
  public onActivitySave: EventEmitter<Activity> = new EventEmitter();

  constructor(
    public conversionService: ConversionService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
  }

  initRename() {
    this.renameMode = true;
    this.newTitle = this.activity.title;
  }

  initChangeStartTime() {
    this.changeStartTimeMode = true;
    this.newStartTime = this.activity.startTime;
  }

  initChangeEndTime() {
    this.changeEndTimeMode = true;
    this.newEndTime = this.activity.endTime;
  }

  initUpdateComment() {
    this.updateCommentMode = true;
    this.newComment = this.activity.comment;
  }

  rename() {
    this.activityService.renameActivity(this.activity, this.newTitle!)
      .subscribe(updatedActivity => {
        this.activity = updatedActivity;
        this.activityService.resolveTagDetails([this.activity]);
      });
    this.renameMode = false;
  }

  changeStartTime() {
    this.activityService.startActivity(this.activity, this.newStartTime!)
      .subscribe(updatedActivity => {
        this.activity = updatedActivity;
        this.activityService.resolveTagDetails([this.activity]);
      });
    this.changeStartTimeMode = false;
  }

  changeEndTime() {
    this.activityService.finishActivity(this.activity, this.newEndTime!)
      .subscribe(updatedActivity => {
        this.activity = updatedActivity;
        this.activityService.resolveTagDetails([this.activity]);
      });
    this.changeEndTimeMode = false;
  }

  updateComment() {
    this.activityService.updateActivityComment(this.activity, this.newComment!)
      .subscribe(updatedActivity => {
        this.activity = updatedActivity;
        this.activityService.resolveTagDetails([this.activity]);
      });
    this.updateCommentMode = false;
  }

  // DELETE
  save() {
    if(!this.activity) {
      return;
    }
    this.onActivitySave.emit(this.activity);
    this.editMode = false;
  }

  edit() {
    this.editMode = true;
  }

  toDate(time: string): Date | undefined {
    return !!time ? new Date(time) : undefined;
  }

  toNumber(value: string): number | undefined {
    return !isNaN(+value) && !isNaN(parseFloat(value)) ? +value : undefined;
  }

  addNewTag(tag: Tag): void {
    this.activityService.addTagToActivity(this.activity, tag)
      .subscribe(updatedActivity => {
        this.activity = updatedActivity;
        this.activityService.resolveTagDetails([this.activity]);
      });
  }

  deleteTag(tag: Tag): void {
    this.activityService.removeTagFromActivity(this.activity, tag)
      .subscribe(updatedActivity => {
        this.activity = updatedActivity;
        this.activityService.resolveTagDetails([this.activity]);
      });
  }

  setMetricValue(metricValue: MetricValue) {
    this.activityService.setActivityMetricValue(this.activity, metricValue)
      .subscribe(updatedActivity => {
        this.activity = updatedActivity;
        this.activityService.resolveTagDetails([this.activity]);
      });
  }

  unsetMetricValue(metricValue: MetricValue) {
    this.activityService.unsetActivityMetricValue(this.activity, metricValue)
      .subscribe(updatedActivity => {
        this.activity = updatedActivity;
        this.activityService.resolveTagDetails([this.activity]);
      });
  }
}
