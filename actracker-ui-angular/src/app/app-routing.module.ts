import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlanEditorComponent } from './plan-editor/plan-editor.component';
import { ActivityEditorComponent } from './activity-editor/activity-editor.component';
import { PlanListComponent } from './plan-list/plan-list.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { DiagnosticsComponent } from './diagnostics/diagnostics.component';


// TODO [mc] visit https://angular.io/tutorial/toh-pt5 to improve routing
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'plans', component: PlanListComponent },
  { path: 'create-plan', component: PlanEditorComponent },
  { path: 'edit-plan/:id', component: PlanEditorComponent },
  { path: 'activities', component: ActivityListComponent },
  { path: 'create-activity', component: ActivityEditorComponent },
  { path: 'edit-activity/:id', component: ActivityEditorComponent },
  { path: 'diagnostics', component: DiagnosticsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
