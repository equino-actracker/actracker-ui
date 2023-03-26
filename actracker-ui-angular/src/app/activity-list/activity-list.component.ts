import { Component, OnInit } from '@angular/core';

import { ActivityService } from '../activity.service';

import { Activity } from '../activity';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  activities: Activity[] = [];

  constructor(
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.activityService.getActivities()
      .subscribe(activitiesResult => this.activities = activitiesResult.activities);
  }

  addActivity(): void {
    let newActivity: Activity = {
      isSaved: false
    }
    this.activities.unshift(newActivity)
  }

  deleteActivity(activity: Activity): void {
    this.activityService.deleteActivity(activity)
      .subscribe(() => {
        let index = this.activities.findIndex(a => a.id === activity.id)
        this.activities.splice(index, 1)
      })
  }

}
