import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  addNewTag(tag: Tag): void {
    this.activity.tags.unshift(tag);
  }

  deleteTag(tag: Tag): void {
    this.activity.tags = this.activity.tags.filter(t => t !== tag)
  }

}
