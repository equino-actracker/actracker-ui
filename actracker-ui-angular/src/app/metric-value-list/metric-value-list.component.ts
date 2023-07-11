import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MetricValue } from '../activity';

@Component({
  selector: 'app-metric-value-list',
  templateUrl: './metric-value-list.component.html',
  styleUrls: ['./metric-value-list.component.css']
})
export class MetricValueListComponent implements OnInit {

  @Input()
  metricValues!: MetricValue[];

  @Output()
  onMetricValueSet: EventEmitter<MetricValue> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  setMetricValue(metricValue: MetricValue) {
    this.onMetricValueSet.emit(metricValue);
  }

}
