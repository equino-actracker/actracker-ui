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
        catchError((error) => {
          console.error('Error occurred during searching activities');
          console.error(error);
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
        catchError((error) => {
          console.error('Error occurred during activity creation');
          console.error(error);
          return []; // TODO [mc] What should I return here?
        })
      );
  }

  deleteActivity(activity: Activity): Observable<any> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}`;
    return this.http.delete(url)
      .pipe(
        catchError((error) => {
          console.error('Error occurred during deleting activity');
          console.error(error);
          return [];
        })
      );
  }

  renameActivity(activity: Activity, newTitle: string): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}/title`;
    return this.http.put(url, newTitle)
      .pipe(
        map(response => this.toActivity(response)),
        catchError(() => {
          console.error('Error occurred during renaming activity');
          return [];
        })
      );
  }

  startActivity(activity: Activity, newStartTime: Date): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}/startTime`;
    return this.http.put(url, newStartTime?.getTime())
      .pipe(
        map(response => this.toActivity(response)),
        catchError(() => {
          console.error('Error occurred during updating activity');
          return [];
        })
      );
  }

  finishActivity(activity: Activity, newEndTime: Date): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}/endTime`;
    return this.http.put(url, newEndTime?.getTime())
      .pipe(
        map(response => this.toActivity(response)),
        catchError(() => {
          console.error('Error occurred during updating activity');
          return [];
        })
      );
  }

  updateActivityComment(activity: Activity, newComment: string): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}/comment`;
    return this.http.put(url, newComment)
      .pipe(
        map(response => this.toActivity(response)),
        catchError(() => {
          console.error('Error occurred during updating activity');
          return [];
        })
      );
  }

  addTagToActivity(activity: Activity, tag: Tag): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}/tag`;
    return this.http.post(url, tag)
      .pipe(
        map(response => this.toActivity(response)),
        catchError(() => {
          console.error('Error occurred during assigning tag to activity');
          return [];
        })
      );
  }

  removeTagFromActivity(activity: Activity, tag: Tag): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}/tag/${tag.id}`;
    return this.http.delete(url)
      .pipe(
        map(response => this.toActivity(response)),
        catchError(() => {
          console.error('Error occurred during removing tag from activity');
          return [];
        })
      );
  }

  setActivityMetricValue(activity: Activity, metricValue: MetricValue): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}/metric/${metricValue.metricId}/value`;
    return this.http.put(url, metricValue.value)
      .pipe(
        map(response => this.toActivity(response)),
        catchError(() => {
          console.error('Error occurred during setting metric value for activity');
          return [];
        })
      );
  }

  unsetActivityMetricValue(activity: Activity, metricValue: MetricValue): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}/metric/${metricValue.metricId}/value`;
    return this.http.delete(url)
      .pipe(
        map(response => this.toActivity(response)),
        catchError(() => {
          console.error('Error occurred during unsetting metric value for activity');
          return [];
        })
      );
  }

  switchToActivity(activity: Activity): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/switched`;
    let activityPayload = this.toActivityPayload(activity);
    return this.http.post(url, activityPayload)
      .pipe(
        map(response => this.toActivity(response)),
        catchError((error) => {
          console.error("Error occurred during switching to activity");
          console.error(error);
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
        .filter(metricValue => !!metricValue.metricId)
        .filter(metricValue => !!metricValue.value)
        .map(this.toMetricValuePayload)
    }
    return activityPayload;
  }

  toMetricValuePayload(metricValue: MetricValue): MetricValuePayload {
    return <MetricValuePayload>{
      metricId: metricValue.metricId,
      value: metricValue.value
    };
  }

  toActivitiesSearchResult(searchResult: ActivitiesSearchResultPayload): ActivitiesResult {
    let activitiesResult: ActivitiesResult = {
      nextPageId: searchResult.nextPageId,
      activities: searchResult.results.map(activityPayload => <Activity>this.toActivity(activityPayload))
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
      metricValues: activityPayload.metricValues?.map(metricValuePayload => <MetricValue>this.toMetricValue(metricValuePayload)) ?? []
    }

    return activity;
  }

  toMetricValue(metricValuePayload: MetricValuePayload): MetricValue {
    return <MetricValue>{
      metricId: metricValuePayload.metricId,
      value: metricValuePayload.value
    };
  }

  resolveTagDetails(activities: Activity[]) {
    var tags: Tag[] = activities.flatMap(activity => activity.tags);
    var tagIds: string[] = tags
      .filter(tag => !!tag.id)
      .map(tag => tag.id!);
    this.tagService.resolveTags(tagIds).subscribe(tagResults => {
      activities.forEach(activity => this.tagService.updateTagDetails(activity.tags, tagResults));
      activities.forEach(activity => this.updateMetrics(activity));
    });
  }

  private updateMetrics(activity: Activity): void {
    var existingMetricValueIds = activity.metricValues
      .filter(metricValue => !!metricValue.metricId)
      .map(metricValue => metricValue.metricId);
    activity.tags
      .flatMap(tag => tag.metrics)
      .filter(metric => !!metric?.id)
      .forEach(metric => {
        if(!existingMetricValueIds.includes(metric.id!)) {
          activity.metricValues.push(this.metricToValue(metric));
        } else {
          var existingMetricValue = activity.metricValues.find(metricValue => metricValue.metricId == metric.id);
          existingMetricValue!.name = metric.name;
        }
      });
  }

  metricToValue(metric: Metric) {
    return <MetricValue>{
      metricId: metric.id,
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
  metricId?: string,
  value?: number
}

interface ActivitiesSearchResultPayload {
  nextPageId: string,
  results: ActivityPayload[]
}
