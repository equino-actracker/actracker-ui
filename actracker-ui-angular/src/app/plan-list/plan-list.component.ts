import { Component, OnInit } from '@angular/core';

import { PlanService } from '../plan.service';
import { SessionService } from '../session.service';

import { Plan } from '../plan';
import { PlansResult } from '../plansResult';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit {

  plans: Plan[] = [];

  constructor(
    private planService: PlanService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.planService.getPlans()
      .subscribe(plansResult => this.plans = plansResult.plans)
  }

  onPlanSelect(plan: Plan) {
    this.sessionService.selectPlan(plan);
  }

  onPlanDelete(plan: Plan) {
    const index: number = this.plans.indexOf(plan);
    this.planService.deletePlan(plan.id!)
      .subscribe(() => {
        this.plans.splice(index, 1);
      });
  }
}
