import { Component, OnInit, Input } from '@angular/core';

import { TagService } from '../tag.service';

import { Tag } from '../tag';
import { Metric } from '../tag';
import { Share } from '../share';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  @Input()
  tag!: Tag;
  @Input()
  renameMode?: boolean;
  @Input()
  newName?: string;

  newShare: string = '';

  constructor(
    private tagService: TagService
  ) { }

  ngOnInit(): void {
  }

  initRename() {
    this.newName = this.tag.name;
    this.renameMode = true;
  }

  rename() {
    this.tagService.renameTag(this.tag, this.newName!)
      .subscribe(updatedTag =>
        this.tag = updatedTag
      );
    this.renameMode = false;
  }

  addMetric(metric: Metric): void {
    this.tagService.addMetric(this.tag, metric)
      .subscribe(tag => {
        this.tag = tag;
      });
  }

  deleteMetric(metric: Metric): void {
    this.tagService.deleteMetric(this.tag, metric)
      .subscribe(tag => {
        this.tag = tag;
      });
  }

  renameMetric(metric: Metric): void {
    this.tagService.renameMetric(this.tag, metric, metric.name)
      .subscribe(tag => {
        this.tag = tag;
      });
  }

  share(): void {
    if(this.tag.id && this.newShare!='') {
      let share: Share = {granteeName: this.newShare}
      this.tagService.shareTag(this.tag, share)
        .subscribe(tag => {
          this.tag.shares = tag.shares;
          this.newShare = '';
        });
    }
  }

}
