import { Component, OnInit, Input } from '@angular/core';

import { Chart } from '../dashboard';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input()
  chart!: Chart;
  @Input()
  editMode!: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
