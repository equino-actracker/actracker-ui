import { Component, OnInit } from '@angular/core';

import { ActivityService } from '../activity.service';
import { TagSetService } from '../tag-set.service';

import { Activity, MetricValue } from '../activity';
import { TagSet } from '../tagSet';

@Component({
  selector: 'app-tag-set-list',
  templateUrl: './tag-set-list.component.html',
  styleUrls: ['./tag-set-list.component.css']
})
export class TagSetListComponent implements OnInit {

  nextPageId?: string = undefined;
  tagSets: TagSet[] = [];

  addedTagSets: TagSet[] = [];

  activityToSwitch?: Activity;
  tagSetToAdd?: TagSet;

  constructor(
    private activityService: ActivityService,
    private tagSetService: TagSetService
  ) { }

  ngOnInit(): void {
    this.fetchNextPage();
  }

  fetchNextPage(): void {
    let pageId = this.nextPageId;
    this.nextPageId = undefined;
    this.tagSetService.searchTagSets(undefined, pageId, 10, this.addedTagSets)
          .subscribe(tagSetsResult => {
            let foundTagSets = tagSetsResult.tagSets;
            this.tagSets = this.tagSets.concat(tagSetsResult.tagSets);
            this.nextPageId = tagSetsResult.nextPageId;
          });
  }

  initTagSetAdd(): void {
    this.tagSetToAdd = {tags:[]};
  }

  initActivitySwitch(tagSet: TagSet): void {
    var metricValues: MetricValue[] | undefined = tagSet.tags
          .flatMap(tag => tag.metrics)
          .filter(metric => !!metric?.id)
          .map(metric => this.activityService.metricToValue(metric));
    this.activityToSwitch = {
      title: tagSet.name,
      tags: tagSet.tags,
      metricValues: metricValues ?? []
    }
  }

  switchToActivity(activity: Activity): void {
    this.activityService.switchToActivity(activity)
      .subscribe(() => {
        this.activityToSwitch = undefined;
      });
  }

  deleteTagSet(tagSet: TagSet): void {
    if(tagSet.id) {
      if(confirm('Delete tag set?')) {
          this.tagSetService.deleteTagSet(tagSet)
            .subscribe(() => {
              this.tagSets = this.tagSets.filter(tS => tS !== tagSet)
            })
      }
    } else {
      this.tagSets = this.tagSets.filter(tS => tS !== tagSet)
    }
  }

  addTagSet(tagSet: TagSet): void {
    this.tagSets.unshift(tagSet);
    this.addedTagSets.unshift(tagSet);
    this.tagSetToAdd = undefined;
  }
}
