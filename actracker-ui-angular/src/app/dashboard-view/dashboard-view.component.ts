import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DashboardService } from '../dashboard.service';
import { DashboardDataService } from '../dashboard-data.service';

import { Dashboard, Chart } from '../dashboard';
import { DashboardData } from '../dashboardData';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {

  editMode: boolean = false;
  dashboard?: Dashboard;
  dashboardData?: DashboardData;

  constructor(
    private dashboardService: DashboardService,
    private dashboardDataService: DashboardDataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let id: string | null = this.route.snapshot.queryParamMap.get('id');
    if(id) {
      this.fetchDashboard(id);
    } else {
      this.editMode = true;
      this.dashboard = {charts: []};
    }
  }

  fetchDashboard(dashboardId: string): void {
    this.dashboardService.getDashboard(dashboardId)
      .subscribe(d => {
        this.dashboard = d;
        this.fetchDashboardData(d);
      });
  }

  fetchDashboardData(dashboard: Dashboard): void {
    this.dashboardDataService.getDashboardData(dashboard)
      .subscribe(data => {
        this.dashboardData = data;
      });
  }

  editDashboard(): void {
    this.editMode = true;
  }

  saveDashboard(): void {
    if(this.dashboard!.id) {
      this.dashboardService.updateDashboard(this.dashboard!)
        .subscribe(d => {
          this.editMode = false;
          this.fetchDashboardData(d);
        });
    } else {
      this.dashboardService.createDashboard(this.dashboard!)
        .subscribe(d => {
          this.dashboard!.id = d.id
          this.editMode = false;
          this.fetchDashboardData(d);
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
