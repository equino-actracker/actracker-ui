import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Dashboard } from './dashboard';
import { DashboardsResult } from './dashboardsResult';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
  ) { }

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
      map(response => this.toDashboardsSearchResult(response)),
      catchError(() => {
        console.error('Error occurred during searching dashboards');
        return []; // TODO [mc] What should I return here?
      })
    );
  }

  createDashboard(dashboard: Dashboard): Observable<Dashboard> {
    let url: string = `${environment.backendBaseUrl}/dashboard`;
    let dashboardPayload = this.toDashboardPayload(dashboard);

    return this.http.post<DashboardPayload>(url, dashboardPayload)
    .pipe(
      map(response => this.toDashboard(response)),
      catchError(() => {
        console.error('Error occurred during dashboard creation');
        return []; // TODO [mc] What should I return here?
      })
    );
  }

  updateDashboard(dashboard: Dashboard): Observable<Dashboard> {
    let url = `${environment.backendBaseUrl}/dashboard/${dashboard.id}`;
    let dashboardPayload = this.toDashboardPayload(dashboard);

    return this.http.put(url, dashboardPayload).pipe(
      map(response => this.toDashboard(response)),
      catchError(() => {
        console.error('Error occurred during updating dashboard');
        return [];
      })
    )
  }

  deleteDashboard(dashboard: Dashboard): Observable<any> {
    let url = `${environment.backendBaseUrl}/dashboard/${dashboard.id}`;
    return this.http.delete(url).pipe(
      catchError(() => {
        console.error('Error occurred during deleting dashboard');
        return [];
      })
    )
  }

  toDashboardPayload(dashboard: Dashboard): DashboardPayload {
    let dashboardPayload: DashboardPayload = {
      id: dashboard.id,
      name: dashboard.name
    }
    return dashboardPayload;
  }

  toDashboardsSearchResult(searchResult: DashboardsSearchResultPayload): DashboardsResult {
    let dashboardsResult: DashboardsResult = {
      nextPageId: searchResult.nextPageId,
      dashboards: searchResult.results.map(this.toDashboard)
    }
    return dashboardsResult;
  }

  toDashboard(dashboardPayload: DashboardPayload): Dashboard {
    let dashboard: Dashboard = {
      id: dashboardPayload.id,
      name: dashboardPayload.name,
    }

    return dashboard;
  }
}

interface DashboardPayload {
  id?: string,
  name?: string
}

interface DashboardsSearchResultPayload {
  nextPageId: string,
  results: DashboardPayload[]
}
