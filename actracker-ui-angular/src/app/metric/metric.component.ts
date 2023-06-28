import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Metric, Tag } from '../tag';

@Component({
  selector: 'app-metric',
  templateUrl: './metric.component.html',
  styleUrls: ['./metric.component.css']
})
export class MetricComponent implements OnInit {

  @Input()
  metric!: Metric;
  @Input()
  renameMode?: boolean;
  @Input()
  newName?: string;
  @Input()
  immutable?: boolean;

  @Output()
  onMetricRename: EventEmitter<Metric> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  initRename(): void {
    if(!this.immutable) {
      this.newName = this.metric.name;
      this.renameMode = true;
    }
  }

  rename(): void {
    if(!this.immutable) {
      let renamedMetric: Metric = {
        id: this.metric.id,
        name: this.newName!,
        type: this.metric.type
      };
      this.renameMode = false;
      this.onMetricRename.emit(renamedMetric);
    }
  }

}
