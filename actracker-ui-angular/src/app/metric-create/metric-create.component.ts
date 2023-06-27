import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Metric } from '../tag';

@Component({
  selector: 'app-metric-create',
  templateUrl: './metric-create.component.html',
  styleUrls: ['./metric-create.component.css']
})
export class MetricCreateComponent implements OnInit {

  metricTypes = [
    {id: "NUMERIC", name: "Numeric"},
  ];

  @Input()
  metric!: Metric;

  @Output()
  onMetricAdd: EventEmitter<Metric> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  createMetric() {
    this.onMetricAdd.emit(this.metric);
  }

}
