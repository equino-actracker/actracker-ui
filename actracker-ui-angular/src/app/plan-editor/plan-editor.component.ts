import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PlanService } from '../plan.service';

import { Plan } from '../plan';

@Component({
  selector: 'app-plan-editor',
  templateUrl: './plan-editor.component.html',
  styleUrls: ['./plan-editor.component.css']
})
export class PlanEditorComponent implements OnInit {

  plan: Plan = {
    name: ''
  };

  constructor(
    private planService: PlanService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let planId: string | null = this.route.snapshot.paramMap.get('id');
    if(planId !== null) {
      this.getPlan(planId);
    }
  }

  save() {
    if(this.plan.id == null) {
      this.planService.createPlan(this.plan);
    } else {
      this.planService.updatePlan(this.plan)
        .subscribe();
    }
  }

  getPlan(planId: string) {
    this.planService.getPlan(planId)
      .subscribe(plan => this.plan = plan);
  }

}
