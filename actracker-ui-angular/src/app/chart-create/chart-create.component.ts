import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Chart } from '../dashboard';
import { Tag } from '../tag';

@Component({
  selector: 'app-chart-create',
  templateUrl: './chart-create.component.html',
  styleUrls: ['./chart-create.component.css']
})
export class ChartCreateComponent implements OnInit {

  chartGroupByTypes = [
    {id: "SELF", name: "Self"},
    {id: "DAY", name: "Day"},
    {id: "WEEK", name: "Week"},
    {id: "WEEKEND", name: "Weekend"},
    {id: "MONTH", name: "Month"},
  ];

  chartMetrics = [
    {id: "TAG_PERCENTAGE", name: "Tag duration percentage"},
    {id: "TAG_DURATION", name: "Duration by tag"},
    {id: "METRIC_VALUE", name: "Tag metric value"},
  ];

  @Input()
  chart!: Chart;

  @Output()
  onChartAdd: EventEmitter<Chart> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  addTagToChart(tag: Tag) {
    this.chart.includedTags.unshift(tag);
  }

  removeTagFromChart(tag: Tag) {
    this.chart.includedTags = this.chart.includedTags.filter(t => t!=tag);
  }

  createChart() {
    this.onChartAdd.emit(this.chart);
  }

}
