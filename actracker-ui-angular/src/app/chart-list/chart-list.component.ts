import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Chart } from '../dashboard';

@Component({
  selector: 'app-chart-list',
  templateUrl: './chart-list.component.html',
  styleUrls: ['./chart-list.component.css']
})
export class ChartListComponent implements OnInit {

  @Input()
  charts!: Chart[];

  @Output()
  onChartAdd: EventEmitter<Chart> = new EventEmitter();
  @Output()
  onChartDelete: EventEmitter<Chart> = new EventEmitter();

  chartToAdd?: Chart;

  constructor() { }

  ngOnInit(): void {
  }

  initChartAdd() {
    this.chartToAdd = {groupBy: '', metric: '', includedTags: []};
  }

  addChart(chart: Chart) {
    this.onChartAdd.emit(chart);
    this.chartToAdd = undefined;
  }

  removeChart(chart: Chart) {
    this.onChartDelete.emit(chart);
  }

}
