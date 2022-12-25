import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { SessionService } from './session.service';

import { environment } from '../environments/environment';

import { Activity } from './activity';
import { ActivitiesResult } from './activitiesResult';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  createPlanUrl = `${environment.backendBaseUrl}/activity`

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) { }

  createActivity(activity: Activity) {
    let selectedPlanId = this.sessionService.getSelectedPlanId();
    let activityPayload = this.toActivityPayload(activity, selectedPlanId);

    this.http.post(this.createPlanUrl, activityPayload)
    .pipe(
      catchError(() => {
        console.error('Error occurred during activity creation');
        return []; // TODO [mc] What should I return here?
      })
    )
    .subscribe();
  }

  updateActivity(activity: Activity): Observable<any> {
    let url = `${environment.backendBaseUrl}/activity/${activity.id}`;
    let selectedPlanId = this.sessionService.getSelectedPlanId();
    let activityPayload = this.toActivityPayload(activity, selectedPlanId);

    return this.http.put(url, activityPayload).pipe(
      catchError(() => {
        console.error('Error occurred during fetching activity');
        return [];
      })
    )
  }

  getActivity(activityId: string): Observable<Activity> {
    let url = `${environment.backendBaseUrl}/activity/${activityId}`;

    return this.http.get<ActivityPayload>(url)
      .pipe(
        map(response => this.toActivity(response)),
        catchError(() => {
          console.error('Error occurred during fetching activity');
          return [];
        })
      )
  }

  getActivities(): Observable<ActivitiesResult> {
    let selectedPlanId: string = this.sessionService.getSelectedPlanId();
    let getActivitiesUrl: string = `${environment.backendBaseUrl}/activity?planId=${selectedPlanId}&pageSize=10`;

    return this.http.get<ActivitiesResultPayload>(getActivitiesUrl)
      .pipe(
        map(response => this.toActivitiesResult(response)),
        catchError(() => {
          console.error('Error occurred during fetching activities');
          return [];
        })
      );
  }

  deleteActivity(activityId: string): Observable<any> {
    let url = `${environment.backendBaseUrl}/activity/${activityId}`;

    return this.http.delete(url)
      .pipe(
        catchError(() => {
          console.error('Error occurred during deleting activity');
          return [];
        })
      );
  }

  toActivityPayload(activity: Activity, selectedPlanId: string): ActivityPayload {
    let activityPayload: ActivityPayload = {
      id: activity.id,
      planId: selectedPlanId,
      startTimestamp: activity.startTime?.getTime(),
      endTimestamp: activity.endTime?.getTime(),
      comment: activity.comment
    }
    return activityPayload;
  }

  toActivity(activityPayload: ActivityPayload): Activity {
    let activity: Activity = {
      id: activityPayload.id,
      comment: activityPayload.comment
    }
    activity.startTime = activityPayload.startTimestamp ? new Date(activityPayload.startTimestamp) : undefined;
    activity.endTime = activityPayload.endTimestamp ? new Date(activityPayload.endTimestamp) : undefined;
    return activity;
  }

  toActivitiesResult(activitiesResultPayload: ActivitiesResultPayload): ActivitiesResult {
    let activitiesResult: ActivitiesResult = {
      activities: activitiesResultPayload.activities.map(this.toActivity)
    }
    return activitiesResult;
  }
}

interface ActivityPayload {
  id?: string,
  planId: string,
  startTimestamp?: number,
  endTimestamp?: number,
  comment?: string
}

interface ActivitiesResultPayload {
  activities: ActivityPayload[]
}
