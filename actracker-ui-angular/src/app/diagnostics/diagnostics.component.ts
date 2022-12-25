import { Component, OnInit } from '@angular/core';

import { SessionService } from '../session.service';

import { environment } from '../../environments/environment' // TODO [mc] remove


@Component({
  selector: 'app-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.css']
})
export class DiagnosticsComponent implements OnInit {

  url: string = environment.backendBaseUrl;
  authHeader: string = '';
  selectedPlan: string = '';

  constructor(
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.authHeader = this.sessionService.getAuthHeader();
    this.selectedPlan = this.sessionService.getSelectedPlanId();
  }

}
