import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TagService } from '../tag.service';

import { Tag, Metric } from '../tag';

@Component({
  selector: 'app-tag-create',
  templateUrl: './tag-create.component.html',
  styleUrls: ['./tag-create.component.css']
})
export class TagCreateComponent implements OnInit {

  @Input()
  tag!: Tag;

  @Output()
  onTagCreated: EventEmitter<Tag> = new EventEmitter();

  constructor(
    private tagService: TagService
  ) { }

  ngOnInit(): void {
  }

  create() {
    this.tagService.createTag(this.tag)
      .subscribe(tag => {
        this.tag.id = tag.id
        this.onTagCreated.emit(this.tag);
      });
  }

  addMetric(metric: Metric) {
    this.tag.metrics.unshift(metric);
  }

  renameMetric(metric: Metric) {
    let metricToRename = this.tag.metrics.find(m => m === metric);
    if(metricToRename) {
      metricToRename.name = metric.name;
    }
  }

  deleteMetric(metric: Metric) {
    this.tag.metrics = this.tag.metrics.filter(m => m != metric);
  }

}
