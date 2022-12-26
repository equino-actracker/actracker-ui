import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  constructor(
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authorizedRequest = request.clone({
      headers: request.headers
        .set('Content-Type', 'application/json')
    });
    return next.handle(authorizedRequest);
  }
}
