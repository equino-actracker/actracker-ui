import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DashboardService } from '../dashboard.service';
import { TagService } from '../tag.service';

import { Dashboard } from '../dashboard';
import { Chart } from '../dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  editMode: boolean = false;
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
      this.editMode = true;
      this.dashboard = {charts: []};
    }
  }

  resolveTagNames(charts: Chart[]) {
    let allTags = charts.flatMap(chart => chart.includedTags);
    this.tagService.resolveTagNames(allTags);
  }

}
