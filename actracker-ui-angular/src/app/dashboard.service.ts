import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { TagService } from './tag.service';

import { Dashboard, Chart } from './dashboard';
import { DashboardsResult } from './dashboardsResult';
import { Tag } from './tag';
import { Share } from './share';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private tagService: TagService
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

  renameDashboard(dashboard: Dashboard, newName: string): Observable<Dashboard> {
    let url = `${environment.backendBaseUrl}/dashboard/${dashboard.id}/name`;
    return this.http.put(url, newName).pipe(
      map(response => this.toDashboard(response)),
      catchError(() => {
        console.error('Error occurred during renaming dashboard');
        return [];
      })
    );
  }

  addChart(dashboard: Dashboard, chart: Chart): Observable<Dashboard> {
    let url = `${environment.backendBaseUrl}/dashboard/${dashboard.id}/chart`;
    let chartPayload = this.toChartPayload(chart);

    return this.http.post(url, chartPayload)
      .pipe(
        map(response => this.toDashboard(response)),
        catchError((error) => {
          console.error("Error occurred during adding chart");
          console.error(error);
          return []; // TODO [mc] What should I return here?
        })
      );
  }

  deleteChart(dashboard: Dashboard, chart: Chart) {
    let url = `${environment.backendBaseUrl}/dashboard/${dashboard.id}/chart/${chart.id}`;

    return this.http.delete(url)
      .pipe(
        map(response => this.toDashboard(response)),
        catchError((error) => {
          console.error("Error occurred during deleting chart");
          console.error(error);
          return []; // TODO [mc] What should I return here?
        })
      );
  }

  shareDashboard(dashboard: Dashboard, share: Share): Observable<Dashboard> {
    let url = `${environment.backendBaseUrl}/dashboard/${dashboard.id}/share`;
    let sharePayload = this.toSharePayload(share);

    return this.http.post(url, sharePayload)
      .pipe(
        map(response => this.toDashboard(response)),
        catchError((error) => {
          console.error("Error occurred during sharing dashboard");
          console.error(error);
          return []; // TODO [mc] What should I return here?
        })
      );
  }

  unshareDashboard(dashboard: Dashboard, share: Share): Observable<Dashboard> {
    let url = `${environment.backendBaseUrl}/dashboard/${dashboard.id}/share/${share.granteeName}`;

    return this.http.delete(url)
      .pipe(
        map(response => this.toDashboard(response)),
        catchError((error) => {
          console.error("Error occurred during unsharing dashboard");
          console.error(error);
          return []; // TODO [mc] What should I return here?
        })
      );
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
      charts: dashboard.charts.map(this.toChartPayload),
      shares: dashboard.shares.map(this.toSharePayload)
    }
  }

  toChartPayload(chart: Chart): ChartPayload {
    return {
      id: chart.id,
      name: chart.name,
      groupBy: chart.groupBy,
      metric: chart.metric,
      includedTags: chart.includedTags.map(tag => tag.id!)
    };
  }

  toSharePayload(share: Share): SharePayload {
    return {
      granteeName: share.granteeName
    }
  }

  toDashboardsSearchResult(searchResult: DashboardsSearchResultPayload): DashboardsResult {
    let dashboardsResult: DashboardsResult = {
      nextPageId: searchResult.nextPageId,
      dashboards: searchResult.results.map(result => <Dashboard>this.toDashboard(result))
    }
    this.resolveTagDetails(dashboardsResult.dashboards);
    return dashboardsResult;
  }

  resolveTagDetails(dashboards: Dashboard[]) {
    var charts: Chart[] = dashboards.flatMap(dashboard => dashboard.charts);
    var tags: Tag[] = charts.flatMap(chart => chart.includedTags);
    var tagIds: string[] = tags
      .filter(tag => !!tag.id)
      .map(tag => tag.id!);
    this.tagService.resolveTags(tagIds).subscribe(tagResults => {
      charts.forEach(chart => this.tagService.updateTagDetails(chart.includedTags, tagResults));
    });
  }

  toDashboard(dashboardPayload: DashboardPayload): Dashboard {
    return {
      id: dashboardPayload.id,
      name: dashboardPayload.name,
      charts: dashboardPayload.charts?.map(chart => <Chart>this.toChart(chart)) ?? [],
      shares: dashboardPayload.shares?.map(share => <Share>this.toShare(share)) ?? []
    };
  }

  toChart(chartPayload: ChartPayload): Chart {
    return {
      id: chartPayload.id,
      name: chartPayload.name,
      groupBy: chartPayload.groupBy ?? '',
      metric: chartPayload.metric ?? '',
      includedTags: chartPayload.includedTags?.map(tagId => <Tag>{id: tagId}) ?? []
    };
  }

  toShare(sharePayload: SharePayload): Share {
    return {
      granteeName: sharePayload.granteeName ?? ''
    };
  }
}

interface SharePayload {
  granteeName?: string
}

interface DashboardPayload {
  id?: string,
  name?: string,
  charts?: ChartPayload[],
  shares?: SharePayload[]
}

interface DashboardsSearchResultPayload {
  nextPageId: string,
  results: DashboardPayload[]
}

interface ChartPayload {
  id?: string,
  name?: string,
  groupBy?: string,
  metric?: string,
  includedTags?: string[]
}
