import { Component, OnInit, Input } from '@angular/core';

import { ActivityService } from '../activity.service';

import { Activity } from '../activity';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  @Input()
  activity?: Activity;
  @Input()
  editMode?: boolean;

  constructor(
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
  }

  save() {
    if(!this.activity) {
      return;
    }
    if(this.activity.id) {
      this.activityService.updateActivity(this.activity)
        .subscribe(activity => this.activity = activity);
    } else {
      this.activityService.createActivity(this.activity)
        .subscribe(activity => this.activity = activity);
    }
    this.editMode = false;
  }

  edit() {
    this.editMode = true;
  }

  toDate(time: string): Date | undefined {
    return !!time ? new Date(time) : undefined;
  }

}
