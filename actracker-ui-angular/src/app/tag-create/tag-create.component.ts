import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TagService } from '../tag.service';

import { Tag, Metric } from '../tag';
import { Share } from '../share';

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
        this.onTagCreated.emit(tag);
      });
  }

  addMetric(metric: Metric) {
    this.tag.metrics.unshift(metric);
  }

  deleteMetric(metric: Metric) {
    this.tag.metrics = this.tag.metrics.filter(m => m != metric);
  }

  addShare(share: Share) {
    this.tag.shares.unshift(share);
  }

  removeShare(share: Share) {
    this.tag.shares = this.tag.shares.filter(sh => sh != share);
  }

}
