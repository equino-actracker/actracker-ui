import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DashboardService } from '../dashboard.service';
import { TagService } from '../tag.service';

import { Dashboard } from '../dashboard';
import { Chart } from '../dashboard';

@Component({
  selector: 'app-dashboard-xxx',
  templateUrl: './dashboard-xxx.component.html',
  styleUrls: ['./dashboard-xxx.component.css']
})
export class DashboardXXXComponent implements OnInit {

  dashboard?: Dashboard;

  constructor(
    private dashboardService: DashboardService,
    private tagService: TagService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let id: string | null = this.route.snapshot.queryParamMap.get('id');
    if(id) {
      this.dashboardService.getDashboard(id)
        .subscribe(d => {
          this.resolveTagNames(d.charts);
          this.dashboard = d;
        });
    } else {
      console.error('Dashboard not found');
    }
  }

  resolveTagNames(charts: Chart[]) {
    let allTags = charts.flatMap(chart => chart.includedTags);
    this.tagService.resolveTagNames(allTags);
  }

}
