import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http'

import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'

import { SessionService } from './session.service'

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  constructor(
    private sessionService: SessionService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.sessionService.keepSessionAlive()
    let authHeader = this.sessionService.getAuthHeader()
    let authorizedRequest = request.clone({
      headers: request.headers
        .set('Content-Type', 'application/json')
        .set('Authorization', authHeader)
    })
    return next.handle(authorizedRequest)
  }
}
