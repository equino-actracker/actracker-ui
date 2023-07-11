import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MetricValue } from '../activity';

@Component({
  selector: 'app-metric-value',
  templateUrl: './metric-value.component.html',
  styleUrls: ['./metric-value.component.css']
})
export class MetricValueComponent implements OnInit {

  @Input()
  metricValue!: MetricValue;

  @Output()
  onMetricValueSet: EventEmitter<MetricValue> = new EventEmitter();

  newValue?: number;

  updateValueMode: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  initValueUpdate() {
    this.newValue = this.metricValue.value;
    this.updateValueMode = true;
  }

  setValue() {
    let newMetricValue: MetricValue = {metricId: this.metricValue.metricId, value: this.newValue};
    this.onMetricValueSet.emit(newMetricValue);
    this.newValue = undefined;
    this.updateValueMode = false;
  }
}
