import { Component, OnInit, Input } from '@angular/core';

import { DashboardService } from '../dashboard.service';

import { Dashboard, Chart } from '../dashboard';
import { Share } from '../share';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input()
  dashboard!: Dashboard;
  @Input()
  renameMode?: boolean;
  @Input()
  newName?: string;

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
  }

  initRename() {
    this.newName = this.dashboard.name;
    this.renameMode = true;
  }

  rename() {
    this.dashboardService.renameDashboard(this.dashboard, this.newName!)
      .subscribe(updatedDashboard => {
        this.dashboard = updatedDashboard;
        this.dashboardService.resolveTagDetails([this.dashboard]);
      });
    this.renameMode = false;
  }

  addChart(chart: Chart) {
    this.dashboardService.addChart(this.dashboard, chart)
      .subscribe(dashboard => {
        this.dashboard = dashboard;
        this.dashboardService.resolveTagDetails([this.dashboard]);
      });
  }

  deleteChart(chart: Chart) {
    this.dashboardService.deleteChart(this.dashboard, chart)
      .subscribe(dashboard => {
        this.dashboard = dashboard;
        this.dashboardService.resolveTagDetails([this.dashboard]);
      });
  }

  addShare(share: Share) {
    this.dashboardService.shareDashboard(this.dashboard, share)
      .subscribe(dashboard => {
        this.dashboard = dashboard;
        this.dashboardService.resolveTagDetails([this.dashboard]);
      });
  }

  removeShare(share: Share) {
    this.dashboardService.unshareDashboard(this.dashboard, share)
      .subscribe(dashboard => {
        this.dashboard = dashboard;
        this.dashboardService.resolveTagDetails([this.dashboard]);
      });
  }
}
