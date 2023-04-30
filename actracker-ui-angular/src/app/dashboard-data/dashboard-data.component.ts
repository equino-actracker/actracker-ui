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

  dateRangeStart?: Date;
  dateRangeEnd?: Date;

  constructor(
    private dashboardDataService: DashboardDataService
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.dashboardDataService.getDashboardData(this.dashboard, this.dateRangeStart, this.dateRangeEnd)
      .subscribe(data => this.dashboardData = data);
  }

  toEndOfDay(date?: string): Date | undefined {
    return this.toDateWithTime(23,59,59,999,date);
  }

  toStartOfDay(date?: string): Date | undefined {
    return this.toDateWithTime(0,0,0,0,date);
  }

  private toDateWithTime(
                          hour: number,
                          minute: number,
                          second: number,
                          millis: number,
                          date?: string,
  ): Date | undefined {

    if(!date) {
      return undefined;
    }
    let dateEndOfDay = new Date(date);
    dateEndOfDay.setHours(hour,minute,second,millis);
    return dateEndOfDay;
  }

}
