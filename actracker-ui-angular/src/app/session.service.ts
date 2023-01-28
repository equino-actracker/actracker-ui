import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  sessionTokenKey = `ovh.equino.actracker-ui.${environment.environment}.sessionTokenKey`;
  sessionExpireTimeKey = `ovh.equino.actracker-ui.${environment.environment}.sessionExpireTimeKey`;
  sessionDuration = 12/*hours*/ * 60/*minutes*/ * 60/*seconds*/;

  constructor() { }

  createSession(username: string, password: string) {
    let authHeader = 'Basic ' + btoa(`${username}:${password}`);
    localStorage.setItem(this.sessionTokenKey, authHeader);
    let sessionExpireTime = new Date();
    sessionExpireTime.setSeconds(sessionExpireTime.getSeconds() + this.sessionDuration);
    localStorage.setItem(this.sessionExpireTimeKey, sessionExpireTime.getTime().toString());

//     this.http.get(this.url)
//     .pipe(
//       catchError(() => {
//         this.closeSession()
//         console.error('Error occurred, probably incorrect username or password');
//         return []; // TODO [mc] What should I return here?
//       })
//     )
//     .subscribe();
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
}
