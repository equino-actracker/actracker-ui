import { Component, OnInit } from '@angular/core';

import { TagService } from '../tag.service';
import { ActivityService } from '../activity.service';

import { Tag } from '../tag';
import { Activity } from '../activity';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  nextPageId?: string = undefined;
  tags: Tag[] = [];

  addedTags: Tag[] = [];

  activityToSwitch?: Activity;

  constructor(
    private tagService: TagService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.fetchNextPage();
  }

  fetchNextPage(): void {
    let pageId = this.nextPageId;
    this.nextPageId = undefined;
    this.tagService.searchTags(undefined, pageId, 10, this.addedTags)
          .subscribe(tagsResult => {
            this.tags = this.tags.concat(tagsResult.tags);
            this.nextPageId = tagsResult.nextPageId;
          });
  }

  addTag(): void {
    let newTag: Tag = {metrics: []};
    this.tags.unshift(newTag);
    this.addedTags.unshift(newTag);
  }

  deleteTag(tag: Tag): void {
    if(confirm('Delete tag?')) {
      if(tag.id) {
        this.tagService.deleteTag(tag)
          .subscribe(() => {
            this.tags = this.tags.filter(t => t !== tag)
          })
      } else {
        this.tags = this.tags.filter(t => t !== tag)
      }
    }
  }

  prepareActivityToSwitch(tag: Tag): void {
    this.activityToSwitch = {
      title: tag.name,
      tags: [tag],
      metricValues: []
    }
  }

  switchToActivity(activity: Activity): void {
    this.activityService.switchToActivity(activity)
      .subscribe(() => {
        this.activityToSwitch = undefined;
      });
  }

}
