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

  onActivityDelete(activity: Activity) {
    const index: number = this.activities.indexOf(activity);
    this.activityService.deleteActivity(activity.id!)
      .subscribe(() => {
        this.activities.splice(index, 1);
      });
  }

}
