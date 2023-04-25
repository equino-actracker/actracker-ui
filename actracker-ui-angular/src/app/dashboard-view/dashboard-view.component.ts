import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DashboardService } from '../dashboard.service';

import { Dashboard, Chart } from '../dashboard';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {

  editMode: boolean = false;
  dashboard?: Dashboard;

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let id: string | null = this.route.snapshot.queryParamMap.get('id');
    if(id) {
      this.dashboardService.getDashboard(id)
        .subscribe(d => {
          this.dashboard = d;
        });
    } else {
      this.editMode = true;
      this.dashboard = {charts: []};
    }
  }

  editDashboard(): void {
    this.editMode = true;
  }

  saveDashboard(): void {
    if(this.dashboard!.id) {
      this.dashboardService.updateDashboard(this.dashboard!)
        .subscribe(d => {
          this.editMode = false;
        });
    } else {
      this.dashboardService.createDashboard(this.dashboard!)
        .subscribe(d => {
          this.dashboard!.id = d.id
          this.editMode = false;
        });
    }
  }

  addChart(): void {
    let newChart = {};
    this.dashboard?.charts.unshift(newChart);
  }

  deleteChart(chart: Chart): void {
    if(this.dashboard) {
      this.dashboard.charts = this.dashboard.charts.filter(ch => ch !== chart)
    }
  }

}
