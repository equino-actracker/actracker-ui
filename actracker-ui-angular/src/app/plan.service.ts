import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Plan } from './plan';
import { PlansResult } from './plansResult';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  createPlanUrl = `${environment.backendBaseUrl}/plan`
  getPlansUrl = `${environment.backendBaseUrl}/plan?pageSize=10`

  constructor(
    private http: HttpClient
  ) { }

  createPlan(plan: Plan) {
    this.http.post(this.createPlanUrl, plan)
    .pipe(
      catchError(() => {
        console.error('Error occurred during plan creation');
        return []; // TODO [mc] What should I return here?
      })
    )
    .subscribe();
  }

  updatePlan(plan: Plan): Observable<any> {
    let url = `${environment.backendBaseUrl}/plan/${plan.id}`;
    return this.http.put(url, plan).pipe(
      catchError(() => {
        console.error('Error occurred during fetching plan');
        return [];
      })
    )
  }

  getPlan(planId: string): Observable<Plan> {
    let url = `${environment.backendBaseUrl}/plan/${planId}`;
    return this.http.get<Plan>(url)
    .pipe(
      catchError(() => {
        console.error('Error occurred during fetching plan');
        return [];
      })
    )
  }

  getPlans(): Observable<PlansResult> {
    return this.http.get<PlansResult>(this.getPlansUrl)
    .pipe(
      catchError(() => {
        console.error('Error occurred during fetching plans');
        return [];
      })
    )
  }

  deletePlan(planId: string): Observable<any> {
    let url = `${environment.backendBaseUrl}/plan/${planId}`;
    return this.http.delete(url)
      .pipe(
        catchError(() => {
          console.error('Error occurred during deleting plan');
          return [];
        })
      );
  }
}
