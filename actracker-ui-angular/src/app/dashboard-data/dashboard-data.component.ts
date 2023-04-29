import { Component, OnInit, Input } from '@angular/core';

import { DashboardDataService } from '../dashboard-data.service';

import { Dashboard } from '../dashboard';
import { DashboardData } from '../dashboardData';

@Component({
  selector: 'app-dashboard-data',
  templateUrl: './dashboard-data.component.html',
  styleUrls: ['./dashboard-data.component.css']
})
export class DashboardDataComponent implements OnInit {

  @Input()
  dashboard!: Dashboard;

  dashboardData?: DashboardData;

  constructor(
    private dashboardDataService: DashboardDataService
  ) {}

  ngOnInit(): void {
    this.dashboardDataService.getDashboardData(this.dashboard)
      .subscribe(data => this.dashboardData = data);
  }

}
