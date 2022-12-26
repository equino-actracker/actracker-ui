import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Activity } from './activity';
import { ActivitiesResult } from './activitiesResult';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private http: HttpClient,
  ) { }

  getActivities(): Observable<ActivitiesResult> {
    let getActivitiesUrl: string = `${environment.backendBaseUrl}/activity`;

    return this.http.get<ActivityPayload[]>(getActivitiesUrl)
      .pipe(
        map(response => this.toActivitiesResult(response)),
        catchError(() => {
          console.error('Error occurred during fetching activities');
          return [];
        })
      );
  }

  toActivitiesResult(activities: ActivityPayload[]): ActivitiesResult {
    let activitiesResult: ActivitiesResult = {
      activities: activities.map(this.toActivity)
    }
    return activitiesResult;
  }

  toActivity(activityPayload: ActivityPayload): Activity {
    let activity: Activity = {
      id: activityPayload.id,
    }
    activity.startTime = activityPayload.startTimestamp ? new Date(activityPayload.startTimestamp) : undefined;
    activity.endTime = activityPayload.endTimestamp ? new Date(activityPayload.endTimestamp) : undefined;
    return activity;
  }
}

interface ActivityPayload {
  id?: string,
  startTimestamp?: number,
  endTimestamp?: number,
}

interface ActivitiesResultPayload {
  activities: ActivityPayload[]
}
