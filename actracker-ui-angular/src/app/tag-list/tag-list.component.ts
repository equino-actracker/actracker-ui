import { Component, OnInit } from '@angular/core';

import { TagService } from '../tag.service';
import { ActivityService } from '../activity.service';

import { Tag } from '../tag';
import { Activity, MetricValue } from '../activity';

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
  tagToAdd?: Tag;

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

  initTagCreate() {
    this.tagToAdd = {metrics: []};
  }

  initActivitySwitch(tag: Tag): void {
    var metricValues: MetricValue[] | undefined = tag.metrics
      .filter(metric => !!metric.id)
      .map(metric => this.activityService.metricToValue(metric));
    this.activityToSwitch = {
      title: tag.name,
      tags: [tag],
      metricValues: metricValues ?? []
    }
  }

  addTag(tag: Tag): void {
    this.tags.unshift(tag);
    this.addedTags.unshift(tag);
    this.tagToAdd = undefined;
  }

  deleteTag(tag: Tag): void {
    if(tag.id) {
      if(confirm('Delete tag?')) {
          this.tagService.deleteTag(tag)
            .subscribe(() => {
              this.tags = this.tags.filter(t => t !== tag)
            })
      }
    } else {
      this.tags = this.tags.filter(t => t !== tag)
    }
  }

  switchToActivity(activity: Activity): void {
    this.activityService.switchToActivity(activity)
      .subscribe(() => {
        this.activityToSwitch = undefined;
      });
  }

}
