import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Dashboard } from './dashboard';
import { DashboardData, ChartData, BucketData } from './dashboardData';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor(
        private http: HttpClient,
  ) {}

  getDashboardData(dashboard: Dashboard): Observable<DashboardData> {
    let url: string = `${environment.backendBaseUrl}/dashboard/${dashboard.id}/data`;

    return this.http.get<DashboardDataPayload>(url)
      .pipe(
        map(response => this.toDashboardData(response)),
        catchError(() => {
          console.error('Error occurred during fetching dashboard data');
          return []; // TODO [mc] What should I return here?
        }
      ))
  }

  toDashboardData(payload: DashboardDataPayload): DashboardData {
    let dashboardData: DashboardData = {
      name: payload.name ? payload.name : '',
      charts: payload.charts ? payload.charts.map(chartDataPayload => this.toChartData(chartDataPayload)) : []
    };

    return dashboardData;
  }

  toChartData(payload: ChartDataPayload): ChartData {
    let chartData: ChartData = {
      name: payload.name ? payload.name : '',
      buckets: payload.buckets ? payload.buckets.map(this.toBucketData) : []
    };

    return chartData;
  }

  toBucketData(payload: BucketDataPayload): BucketData {
    let bucketData: BucketData = {
      name: payload.name ? payload.name : '',
      value: payload.value ? payload.value : 0,
      percentage: payload.percentage ? payload.percentage : 0,
    };

    return bucketData;
  }
}

interface DashboardDataPayload {
  name?: string,
  charts?: ChartDataPayload[]
}

interface ChartDataPayload {
  name?: string,
  buckets?: BucketDataPayload[]
}

interface BucketDataPayload {
  name?: string,
  value?: number,
  percentage?: number
}

