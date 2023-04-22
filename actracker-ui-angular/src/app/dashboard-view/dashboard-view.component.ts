import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DashboardService } from '../dashboard.service';

import { Dashboard } from '../dashboard';

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
    if(!id) {
      this.editMode = true;
      this.dashboard = {};
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

}
