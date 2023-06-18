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

  metricTypes = [
    {id: "NUMERIC", name: "Numeric"},
  ];

  @Input()
  tag!: Tag;
  @Input()
  editMode?: boolean;

  newShare: string = '';

  constructor(
    private tagService: TagService
  ) { }

  ngOnInit(): void {
  }

  save(): void {
    if(!this.tag) {
      return;
    }
    if(this.tag.id) {
      this.tagService.updateTag(this.tag)
        .subscribe(tag => {
        });
    } else {
      this.tagService.createTag(this.tag)
        .subscribe(tag => {
          this.tag.id = tag.id
        });
    }
    this.editMode = false;
  }

  edit(): void {
    this.editMode = true;
  }

  addMetric(): void {
    let newMetric = {name: '', type: 'NUMERIC'};
    this.tag.metrics.unshift(newMetric);
  }

  deleteMetric(metric: Metric): void {
    this.tag.metrics = this.tag.metrics.filter(m => m != metric);
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
