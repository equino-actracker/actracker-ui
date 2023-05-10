import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Dashboard, Chart } from './dashboard';
import { DashboardsResult } from './dashboardsResult';
import { Tag } from './tag';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
  ) {}

  searchDashboards(term?: String, pageId?: String, pageSize?: number, excludedDashboards?: Dashboard[]): Observable<DashboardsResult> {
    let url: string = `${environment.backendBaseUrl}/dashboard/matching`;
    let requestParams = [];
    if(!!term) {
      requestParams.unshift(`term=${term}`)
    }
    if(!!pageId) {
      requestParams.unshift(`pageId=${pageId}`)
    }
    if(!!pageSize) {
      requestParams.unshift(`pageSize=${pageSize}`)
    }
    if(!!excludedDashboards) {
      requestParams.unshift(`excludedDashboards=${excludedDashboards.map(dashboard => dashboard.id).join(',')}`)
    }
    if(requestParams.length > 0) {
      url = `${url}?${requestParams.join('&')}`
    }

    return this.http.get<DashboardsSearchResultPayload>(url)
      .pipe(
        map(response => this.toDashboardsSearchResult(<DashboardsSearchResultPayload>response)),
        catchError((error) => {
          console.error('Error occurred during searching dashboards');
          console.error(error);
          return []; // TODO [mc] What should I return here?
        })
      );
  }

  getDashboard(dashboardId: string): Observable<Dashboard> {
    let url: string = `${environment.backendBaseUrl}/dashboard/${dashboardId}`;

    return this.http.get<DashboardPayload>(url)
      .pipe(
        map(response => this.toDashboard(response)),
        catchError((error) => {
          console.error('Error occurred during fetching dashboard');
          console.error(error);
          return []; // TODO [mc] What should I return here?
        }
      ))
  }

  createDashboard(dashboard: Dashboard): Observable<Dashboard> {
    let url: string = `${environment.backendBaseUrl}/dashboard`;
    let dashboardPayload = this.toDashboardPayload(dashboard);

    return this.http.post<DashboardPayload>(url, dashboardPayload)
      .pipe(
        map(response => this.toDashboard(response)),
        catchError((error) => {
          console.error('Error occurred during dashboard creation');
          console.error(error);
          return []; // TODO [mc] What should I return here?
        })
      );
  }

  updateDashboard(dashboard: Dashboard): Observable<Dashboard> {
    let url = `${environment.backendBaseUrl}/dashboard/${dashboard.id}`;
    let dashboardPayload = this.toDashboardPayload(dashboard);

    return this.http.put(url, dashboardPayload).pipe(
      map(response => this.toDashboard(<DashboardPayload>response)),
      catchError((error) => {
        console.error('Error occurred during updating dashboard');
        console.error(error);
        return [];
      })
    )
  }

  deleteDashboard(dashboard: Dashboard): Observable<any> {
    let url = `${environment.backendBaseUrl}/dashboard/${dashboard.id}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error('Error occurred during deleting dashboard');
        console.error(error);
        return [];
      })
    )
  }

  toDashboardPayload(dashboard: Dashboard): DashboardPayload {
    return {
      id: dashboard.id,
      name: dashboard.name,
      charts: dashboard.charts.map(this.toChartPayload)
    }
  }

  toChartPayload(chart: Chart): ChartPayload {
    return {
      name: chart.name,
      groupBy: chart.groupBy,
      includedTags: chart.includedTags.map(tag => tag.id!)
    };
  }

  toDashboardsSearchResult(searchResult: DashboardsSearchResultPayload): DashboardsResult {
    return {
      nextPageId: searchResult.nextPageId,
      dashboards: searchResult.results.map(result => <Dashboard>this.toDashboard(result))
    }
  }

  toDashboard(dashboardPayload: DashboardPayload): Dashboard {
    return {
      id: dashboardPayload.id,
      name: dashboardPayload.name,
      charts: dashboardPayload.charts?.map(chart => <Chart>this.toChart(chart)) ?? []
    };
  }

  toChart(chartPayload: ChartPayload): Chart {
    return {
      name: chartPayload.name,
      groupBy: chartPayload.groupBy ?? 'TAG',
      includedTags: chartPayload.includedTags?.map(tagId => <Tag>{id: tagId}) ?? []
    };
  }
}

interface DashboardPayload {
  id?: string,
  name?: string,
  charts?: ChartPayload[]
}

interface DashboardsSearchResultPayload {
  nextPageId: string,
  results: DashboardPayload[]
}

interface ChartPayload {
  name?: string,
  groupBy?: string,
  includedTags?: string[]
}
