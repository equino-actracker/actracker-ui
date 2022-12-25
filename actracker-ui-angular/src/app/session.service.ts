import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Plan } from './plan'

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  sessionTokenKey = `ovh.equino.actracker-ui.${environment.environment}.sessionTokenKey`;
  sessionExpireTimeKey = `ovh.equino.actracker-ui.${environment.environment}.sessionExpireTimeKey`;
  selectedPlanKey = `ovh.equino.actracker-ui.${environment.environment}.selectedPlanKey`;
  sessionDuration = 12 * 60 * 60;  // 12 hours

  url = `${environment.backendBaseUrl}/tenant/login`

  constructor(
    private http: HttpClient
  ) {}

  createSession(username: string, password: string) {
    let authHeader = 'Basic ' + btoa(`${username}:${password}`);
    localStorage.setItem(this.sessionTokenKey, authHeader);
    let sessionExpireTime = new Date();
    sessionExpireTime.setSeconds(sessionExpireTime.getSeconds() + this.sessionDuration);
    localStorage.setItem(this.sessionExpireTimeKey, sessionExpireTime.getTime().toString());

    this.http.get(this.url)
    .pipe(
      catchError(() => {
        this.closeSession()
        console.error('Error occurred, probably incorrect username or password');
        return []; // TODO [mc] What should I return here?
      })
    )
    .subscribe();
  }

  closeSession() {
    localStorage.setItem(this.sessionTokenKey, '');
    localStorage.setItem(this.sessionExpireTimeKey, '0');
  }

  isSessionActive() {
    let now = new Date();
    let storedExpireTimestamp = Number(localStorage.getItem(this.sessionExpireTimeKey));
    let expireTime = new Date(storedExpireTimestamp);
    return expireTime > now;
  }

  getAuthHeader() {
    if(!this.isSessionActive()) {
      this.closeSession()
    }
    let sessionToken = localStorage.getItem(this.sessionTokenKey);
    return sessionToken != null ? sessionToken : '';
  }

  selectPlan(plan: Plan) {
    let planId = plan.id == null ? '' : plan.id
    localStorage.setItem(this.selectedPlanKey, planId);
  }

  getSelectedPlanId(): string {
    let selectedPlanId = localStorage.getItem(this.selectedPlanKey);
    return selectedPlanId != null ? selectedPlanId : '';
  }
}
