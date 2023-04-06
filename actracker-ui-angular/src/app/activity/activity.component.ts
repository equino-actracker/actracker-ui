import { Component, OnInit, Input } from '@angular/core';

import { ActivityService } from '../activity.service';

import { Activity } from '../activity';
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
        .subscribe(activity => {
        });
    } else {
      this.activityService.createActivity(this.activity)
        .subscribe(activity => {
          this.activity.id = activity.id
        });
    }
    this.editMode = false;
  }

  edit() {
    this.editMode = true;
  }

  toDate(time: string): Date | undefined {
    return !!time ? new Date(time) : undefined;
  }

  addTag(): void {
    let newTag: Tag = {}
    this.activity.tags.unshift(newTag)
  }

  deleteTag(tag: Tag): void {
    this.activity.tags = this.activity.tags.filter(t => t !== tag)
  }

}
