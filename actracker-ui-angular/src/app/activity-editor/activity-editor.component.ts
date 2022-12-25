import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ActivityService } from '../activity.service';

import { Activity } from '../activity';

@Component({
  selector: 'app-activity-editor',
  templateUrl: './activity-editor.component.html',
  styleUrls: ['./activity-editor.component.css']
})
export class ActivityEditorComponent implements OnInit {

  activity: Activity = {};

  constructor(
    private activityService: ActivityService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let activityId: string | null = this.route.snapshot.paramMap.get('id');
    if(activityId !== null) {
      this.getActivity(activityId);
    }
  }

  save() {
    if(this.activity.id == null) {
      this.activityService.createActivity(this.activity);
    } else {
      this.activityService.updateActivity(this.activity)
        .subscribe();
    }
  }

  getActivity(activityId: string) {
    this.activityService.getActivity(activityId)
      .subscribe(activity => this.activity = activity);
  }

  toDate(time: string): Date | undefined {
    return !!time ? new Date(time) : undefined;
  }
}
