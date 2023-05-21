import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Activity, MetricValue } from './activity';
import { ActivitiesResult } from './activitiesResult';
import { Tag, Metric } from './tag';
import { TagService } from './tag.service';
import { TagsResult } from './tagsResult';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private http: HttpClient,
    private tagService: TagService,
  ) { }

  searchActivities(term?: String, pageId?: String, pageSize?: number, excludedActivities?: Activity[], dateRangeStart?: Date, dateRangeEnd?: Date, tags?: Tag[]): Observable<ActivitiesResult> {
    let url: string = `${environment.backendBaseUrl}/activity/matching`;
    let requestParams = ['orderBy=START_TIME.DESC'];
    if(!!term) {
      requestParams.unshift(`term=${term}`)
    }
    if(!!pageId) {
      requestParams.unshift(`pageId=${pageId}`)
    }
    if(!!pageSize) {
      requestParams.unshift(`pageSize=${pageSize}`)
    }
    if(!!excludedActivities) {
      requestParams.unshift(`excludedActivities=${excludedActivities.map(activity => activity.id).join(',')}`)
    }
    if(!!tags) {
      requestParams.unshift(`requiredTags=${tags.map(tag => tag.id).join(',')}`)
    }
    if(!!dateRangeStart) {
      requestParams.unshift(`rangeStartMillis=${dateRangeStart.getTime()}`)
    }
    if(!!dateRangeEnd) {
      requestParams.unshift(`rangeEndMillis=${dateRangeEnd.getTime()}`)
    }
    if(requestParams.length > 0) {
      url = `${url}?${requestParams.join('&')}`
    }

    return this.http.get<ActivitiesSearchResultPayload>(url)
    .pipe(
      map(response => this.toActivitiesSearchResult(response)),
      catchError(() => {
        console.error('Error occurred during searching activities');
        return []; // TODO [mc] What should I return here?
      })
    );
  }

  createActivity(activity: Activity): Observable<Activity> {
    let url: string = `${environment.backendBaseUrl}/activity`;
    let activityPayload = this.toActivityPayload(activity);

    return this.http.post<ActivityPayload>(url, activityPayload)
    .pipe(
      map(response => this.toActivity(response)),
      catchError(() => {
        console.error('Error occurred during activity creation');
        return []; // TODO [mc] What should I return here?
      })
    );
  }

  updateActivity(activity: Activity): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}`;
    let activityPayload = this.toActivityPayload(activity);

    return this.http.put(url, activityPayload).pipe(
      map(response => this.toActivity(response)),
      catchError(() => {
        console.error('Error occurred during updating activity');
        return [];
      })
    )
  }

  deleteActivity(activity: Activity): Observable<any> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}`;
    return this.http.delete(url).pipe(
      catchError(() => {
        console.error('Error occurred during deleting activity');
        return [];
      })
    )
  }

  switchToActivity(activity: Activity): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/switched`;
    let activityPayload = this.toActivityPayload(activity);
    return this.http.post(url, activityPayload).pipe(
      map(response => this.toActivity(response)),
      catchError(() => {
        console.error("Error occurred during switching to activity");
        return [];
      })
    );
  }

  toActivityPayload(activity: Activity): ActivityPayload {
    let activityPayload: ActivityPayload = {
      id: activity.id,
      title: activity.title,
      startTimestamp: activity.startTime?.getTime(),
      endTimestamp: activity.endTime?.getTime(),
      comment: activity.comment,
      tags: activity.tags.map(tag => tag.id!),
      metricValues: activity.metricValues
        .filter(metricValue => !!metricValue.id)
        .filter(metricValue => !!metricValue.value)
        .filter(metricValue => metricValue.value!.length > 0)
        .map(this.toMetricValuePayload)
    }
    return activityPayload;
  }

  toMetricValuePayload(metricValue: MetricValue): MetricValuePayload {
    return <MetricValuePayload>{
      id: metricValue.id,
      value: metricValue.value
    };
  }

  toActivitiesSearchResult(searchResult: ActivitiesSearchResultPayload): ActivitiesResult {
    let activitiesResult: ActivitiesResult = {
      nextPageId: searchResult.nextPageId,
      activities: searchResult.results.map(this.toActivity)
    }
    this.resolveTagDetails(activitiesResult.activities);
    return activitiesResult;
  }

  toActivity(activityPayload: ActivityPayload): Activity {
    let activity: Activity = {
      id: activityPayload.id,
      title: activityPayload.title,
      startTime: activityPayload.startTimestamp ? new Date(activityPayload.startTimestamp) : undefined,
      endTime: activityPayload.endTimestamp ? new Date(activityPayload.endTimestamp) : undefined,
      comment: activityPayload.comment,
      tags: activityPayload.tags ? activityPayload.tags.map(tagId => <Tag>{id: tagId}) : [],
      metricValues: []
    }

    return activity;
  }

  private resolveTagDetails(activities: Activity[]) {
    var tags: Tag[] = activities.flatMap(activity => activity.tags);
    var tagIds: string[] = tags
      .filter(tag => !!tag.id)
      .map(tag => tag.id!);
    this.tagService.resolveTags(tagIds).subscribe(tagResults => {
      activities.forEach(activity => this.updateTagDetails(activity, tagResults));
    });
  }

  private updateTagDetails(activity: Activity, foundTags: TagsResult): void {
    activity.tags.forEach(tag => {
      let matchingTag: Tag | undefined = foundTags.tags.find(result => result.id === tag.id);
      let name: string | undefined = matchingTag?.name ?? tag.id;
      tag.name = name ?? '';
      tag.metrics = matchingTag?.metrics ?? [];
    });
    activity.metricValues = activity.tags
      .flatMap(tag => tag.metrics)
      .filter(metric => !!metric?.id)
      .map(metric => this.toMetricValue(metric));
  }

  toMetricValue(metric: Metric) {
    return <MetricValue>{
      id: metric.id,
      name: metric.name
    };
  }
}

interface ActivityPayload {
  id?: string,
  title?: string,
  startTimestamp?: number,
  endTimestamp?: number,
  comment?: string,
  tags?: string[],
  metricValues?: MetricValuePayload[]
}

interface MetricValuePayload {
  id?: string,
  value?: string
}

interface ActivitiesSearchResultPayload {
  nextPageId: string,
  results: ActivityPayload[]
}
