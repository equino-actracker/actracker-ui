import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Activity } from './activity';
import { ActivitiesResult } from './activitiesResult';
import { Tag } from './tag';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private http: HttpClient,
  ) { }

  searchActivities(term?: String, pageId?: String, pageSize?: number, excludedActivities?: Activity[]): Observable<ActivitiesResult> {
    let url: string = `${environment.backendBaseUrl}/activity/matching`;
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
    if(!!excludedActivities) {
      requestParams.unshift(`excludedActivities=${excludedActivities.map(activity => activity.id).join(',')}`)
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

  toActivityPayload(activity: Activity): ActivityPayload {
    let activityPayload: ActivityPayload = {
      id: activity.id,
      title: activity.title,
      startTimestamp: activity.startTime?.getTime(),
      endTimestamp: activity.endTime?.getTime(),
      comment: activity.comment,
      tags: activity.tags.map(tag => tag.id!)
    }
    return activityPayload;
  }

  toActivitiesSearchResult(searchResult: ActivitiesSearchResultPayload): ActivitiesResult {
    let activitiesResult: ActivitiesResult = {
      nextPageId: searchResult.nextPageId,
      activities: searchResult.results.map(this.toActivity)
    }
    return activitiesResult;
  }

  toActivity(activityPayload: ActivityPayload): Activity {
    let activity: Activity = {
      id: activityPayload.id,
      title: activityPayload.title,
      startTime: activityPayload.startTimestamp ? new Date(activityPayload.startTimestamp) : undefined,
      endTime: activityPayload.endTimestamp ? new Date(activityPayload.endTimestamp) : undefined,
      comment: activityPayload.comment,
      tags: activityPayload.tags ? activityPayload.tags.map(tagId => <Tag>{id: tagId}) : []
    }

    return activity;
  }
}

interface ActivityPayload {
  id?: string,
  title?: string,
  startTimestamp?: number,
  endTimestamp?: number,
  comment?: string,
  tags?: string[]
}

interface ActivitiesResultPayload {
  activities: ActivityPayload[]
}

interface ActivitiesSearchResultPayload {
  nextPageId: string,
  results: ActivityPayload[]
}
