import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DashboardService } from '../dashboard.service';

import { Dashboard, Chart } from '../dashboard';


@Component({
  selector: 'app-dashboard-edit',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.css']
})
export class DashboardEditComponent implements OnInit {

  chartGroupByTypes = [
    {id: "TAG", name: "Tag"},
    {id: "DAY", name: "Day"},
  ];

  @Input()
  dashboard!: Dashboard;

  @Output()
  onDashboardSaved: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
  }

  saveDashboard(): void {
    if(this.dashboard.id) {
      this.dashboardService.updateDashboard(this.dashboard)
        .subscribe(d => {
          this.onDashboardSaved.emit(true);
        });
    } else {
      this.dashboardService.createDashboard(this.dashboard)
        .subscribe(d => {
          this.dashboard.id = d.id;
          this.onDashboardSaved.emit(true);
        });
    }
  }

  addChart(): void {
    let newChart = {groupBy: "TAG"};
    this.dashboard.charts.unshift(newChart);
  }

  deleteChart(chart: Chart): void {
    this.dashboard.charts = this.dashboard.charts.filter(ch => ch !== chart)
  }

  setGroupByType(chart: Chart, groupByTypeId: any): void {
//     chart.groupBy = groupByTypeId;
    console.error(groupByTypeId)
  }

}
