import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ActivityService } from '../activity.service';
import { TagService } from '../tag.service';

import { Activity } from '../activity';
import { Tag } from '../tag';
import { ActivityFilter } from '../activityFilter';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  nextPageId?: string = undefined;
  activities: Activity[] = [];

  addedActivities: Activity[] = [];
  activityFilter: ActivityFilter = {tags: []};

  activityToAdd?: Activity;

  constructor(
    private activityService: ActivityService,
    private tagService: TagService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let tagsParam = this.route.snapshot.paramMap.get('tags');
    let rangeStartParam = this.route.snapshot.paramMap.get('rangeStart');
    let rangeEndParam = this.route.snapshot.paramMap.get('rangeEnd');

    this.activityFilter.dateRangeStart = this.toDate(rangeStartParam);
    this.activityFilter.dateRangeEnd = this.toDate(rangeEndParam);
    this.activityFilter.tags = this.toTags(tagsParam);

    this.tagService.resolveTagNames(this.activityFilter.tags)

    this.fetchNextPage();
  }

  fetchNextPage(): void {
    let pageId = this.nextPageId;
    this.nextPageId = undefined;
    this.activityService.searchActivities(undefined, pageId, 10, this.addedActivities, this.activityFilter.dateRangeStart, this.activityFilter.dateRangeEnd, this.activityFilter.tags)
          .subscribe(activitiesResult => {
            let foundActivities = activitiesResult.activities;
            this.activities = this.activities.concat(foundActivities);
            this.nextPageId = activitiesResult.nextPageId;
          });
  }

  initActivityCreate() {
    this.activityToAdd = {tags:[], metricValues:[]};
  }

  addActivity(activity: Activity) {
    this.activities.unshift(activity);
    this.addedActivities.unshift(activity);
    this.activityToAdd = undefined;
  }

  deleteActivity(activity: Activity): void {
    if(activity.id) {
      if(confirm('Delete activity?')) {
        this.activityService.deleteActivity(activity)
          .subscribe(() => {
            this.activities = this.activities.filter(a => a !== activity)
          })
      }
    } else {
      this.activities = this.activities.filter(a => a !== activity)
    }
  }

  saveActivity(activity: Activity): void {
    if(activity.id) {
      this.activityService.updateActivity(activity)
        .subscribe(a => {
        });
    } else {
      this.activityService.createActivity(activity)
        .subscribe(a => {
          activity.id = a.id
        });
    }
  }

  reload() {
    this.nextPageId = undefined;
    this.activities = [];
    this.addedActivities = [];
    this.fetchNextPage();
  }

  private toTags(jointTagIds: string | null): Tag[] {
    return !jointTagIds ? [] : jointTagIds
      .split(',')
      .map(tagId => <Tag>{id: tagId});
  }

  private toDate(timestamp: string | null): Date | undefined {
    return !!timestamp ? new Date(+timestamp) : undefined;
  }
}
