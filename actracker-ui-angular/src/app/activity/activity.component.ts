import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ActivityService } from '../activity.service';

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
  editMode?: boolean;

  @Output()
  public onActivitySave: EventEmitter<Activity> = new EventEmitter();

  constructor(
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
  }

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
    this.activity.tags.unshift(tag);
    var newMetrics: MetricValue[] = tag.metrics
      .filter(metric => !!metric?.id)
      .map(metric => this.activityService.metricToValue(metric));
    this.activity.metricValues = this.activity.metricValues.concat(newMetrics);
  }

  deleteTag(tag: Tag): void {
    this.activity.tags = this.activity.tags.filter(t => t !== tag);
    var metricsToRemove: string[] = tag.metrics
      .filter(metric => !!metric?.id)
      .map(metric => metric.id!);
    this.activity.metricValues = this.activity.metricValues
      .filter(metric => !!metric.metricId)
      .filter(metric => !metricsToRemove.includes(metric.metricId));
  }

}
