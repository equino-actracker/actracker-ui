import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Dashboard } from './dashboard';
import { DashboardData, ChartData, BucketData } from './dashboardData';
import { Tag } from './tag';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor(
        private http: HttpClient,
  ) {}

  getDashboardData(dashboard: Dashboard, dateRangeStart?: Date, dateRangeEnd?: Date, tags?: Tag[]): Observable<DashboardData> {
    let url: string = `${environment.backendBaseUrl}/dashboard/${dashboard.id}/data`;

    let requestParams = [];
    if(!!dateRangeStart) {
      requestParams.unshift(`rangeStartMillis=${dateRangeStart.getTime()}`)
    }
    if(!!dateRangeEnd) {
      requestParams.unshift(`rangeEndMillis=${dateRangeEnd.getTime()}`)
    }
    if(!!tags) {
      requestParams.unshift(`requiredTags=${tags.map(tag => tag.id).join(',')}`)
    }

    if(requestParams.length > 0) {
      url = `${url}?${requestParams.join('&')}`
    }

    return this.http.get<DashboardDataPayload>(url)
      .pipe(
        map(response => this.toDashboardData(response)),
        catchError((error) => {
          console.error('Error occurred during fetching dashboard data');
          console.error(error);
          return []; // TODO [mc] What should I return here?
        }
      ))
  }

  toDashboardData(payload: DashboardDataPayload): DashboardData {
    return {
      name: payload.name ?? '',
      charts: payload.charts?.map(chartDataPayload => this.toChartData(chartDataPayload)) ?? []
    };
  }

  toChartData(payload: ChartDataPayload): ChartData {
    return {
      name: payload.name ?? '',
      buckets: payload.buckets?.map(bucket => <BucketData>this.toBucketData(bucket)) ?? []
    };
  }

  toBucketData(payload: BucketDataPayload): BucketData {
    return {
      name: payload.name ?? '',
      type: payload.type ?? '',
      value: payload.value,
      percentage: payload.percentage,
      buckets: payload.buckets?.map(bucket => <BucketData>this.toBucketData(bucket))
    };
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
  type?: string,
  percentage?: number,
  buckets?: BucketDataPayload[]
}

