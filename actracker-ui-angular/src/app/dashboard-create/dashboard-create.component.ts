import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DashboardService } from '../dashboard.service';

import { Dashboard } from '../dashboard';
import { Share } from '../share';

@Component({
  selector: 'app-dashboard-create',
  templateUrl: './dashboard-create.component.html',
  styleUrls: ['./dashboard-create.component.css']
})
export class DashboardCreateComponent implements OnInit {

  @Input()
  dashboard!: Dashboard;

  @Output()
  onDashboardCreated: EventEmitter<Dashboard> = new EventEmitter();

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
  }

  create() {
    this.dashboardService.createDashboard(this.dashboard)
      .subscribe(dashboard =>
        this.onDashboardCreated.emit(dashboard)
      );
  }

  addShare(share: Share) {
    this.dashboard.shares.unshift(share);
  }

  removeShare(share: Share) {
    this.dashboard.shares = this.dashboard.shares.filter(sh => sh != share);
  }
}
