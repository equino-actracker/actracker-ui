import { Injectable } from '@angular/core'

import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private sessionTokenKey = `ovh.equino.actracker-ui.${environment.environment}.sessionTokenKey`
  private sessionExpireTimeKey = `ovh.equino.actracker-ui.${environment.environment}.sessionExpireTimeKey`
  private sessionDuration = 24/*hours*/ * 60/*minutes*/ * 60/*seconds*/

  constructor() { }

  createSession(username: string, password: string) {
    let authHeader = 'Basic ' + btoa(`${username}:${password}`)
    localStorage.setItem(this.sessionTokenKey, authHeader)
    this.extendSession()
  }

  keepSessionAlive() {
    if(this.isSessionActive()) {
      this.extendSession()
    }
  }

  private extendSession() {
    let sessionExpireTime = new Date()
    sessionExpireTime.setSeconds(sessionExpireTime.getSeconds() + this.sessionDuration)
    localStorage.setItem(this.sessionExpireTimeKey, sessionExpireTime.getTime().toString())
  }

  isSessionActive() {
    let now = new Date()
    let storedExpireTimestamp = Number(localStorage.getItem(this.sessionExpireTimeKey))
    let expireTime = new Date(storedExpireTimestamp)
    return expireTime > now
  }

  getAuthHeader() {
    if(!this.isSessionActive()) {
      this.closeSession()
    }
    let sessionToken = localStorage.getItem(this.sessionTokenKey)
    return sessionToken != null ? sessionToken : ''
  }

  private closeSession() {
    localStorage.setItem(this.sessionTokenKey, '')
    localStorage.setItem(this.sessionExpireTimeKey, '0')
  }
}
