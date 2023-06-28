import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Metric } from '../tag';

@Component({
  selector: 'app-metric-list',
  templateUrl: './metric-list.component.html',
  styleUrls: ['./metric-list.component.css']
})
export class MetricListComponent implements OnInit {

  @Input()
  metrics!: Metric[];
  @Input()
  immutable?: boolean;

  @Output()
  onMetricAdd: EventEmitter<Metric> = new EventEmitter();
  @Output()
  onMetricDelete: EventEmitter<Metric> = new EventEmitter();
  @Output()
  onMetricRename: EventEmitter<Metric> = new EventEmitter();

  metricToAdd?: Metric;

  constructor() { }

  ngOnInit(): void {
  }

  initMetricAdd(): void {
    this.metricToAdd = {name: '', type: 'NUMERIC'};
  }

  addMetric(metric: Metric): void {
    this.onMetricAdd.emit(metric);
    this.metricToAdd = undefined;
  }

  deleteMetric(metric: Metric): void {
    if(confirm('Delete metric?')) {
      this.onMetricDelete.emit(metric);
    }
  }

  renameMetric(metric: Metric): void {
    this.onMetricRename.emit(metric);
  }

}
