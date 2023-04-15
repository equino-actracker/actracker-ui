import { Component, OnInit } from '@angular/core';

import { ActivityService } from '../activity.service';
import { TagService } from '../tag.service';

import { Activity } from '../activity';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  nextPageId?: string = undefined;
  activities: Activity[] = [];

  addedActivities: Activity[] = [];

  constructor(
    private activityService: ActivityService,
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    this.fetchNextPage();
  }

  fetchNextPage(): void {
    let pageId = this.nextPageId;
    this.nextPageId = undefined;
    this.activityService.searchActivities(undefined, pageId, 10, this.addedActivities)
          .subscribe(activitiesResult => {
            let foundActivities = activitiesResult.activities;
            this.activities = this.activities.concat(foundActivities);
            this.nextPageId = activitiesResult.nextPageId;
            this.resolveTagNames(foundActivities);
          });
  }

  resolveTagNames(activities: Activity[]) {
    let allTags = activities.flatMap(activity => activity.tags);
    this.tagService.resolveTagNames(allTags);
  }

  addActivity(): void {
    let newActivity: Activity = {tags: []};
    this.activities.unshift(newActivity);
    this.addedActivities.unshift(newActivity);
  }

  deleteActivity(activity: Activity): void {
    if(activity.id) {
      this.activityService.deleteActivity(activity)
        .subscribe(() => {
          this.activities = this.activities.filter(a => a !== activity)
        })
    } else {
      this.activities = this.activities.filter(a => a !== activity)
    }
  }

}
