import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagSetListComponent } from './tag-set-list/tag-set-list.component';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { LoginComponent } from './login/login.component';


// TODO [mc] visit https://angular.io/tutorial/toh-pt5 to improve routing
const routes: Routes = [
  { path: 'activities', component: ActivityListComponent },
  { path: 'tags', component: TagListComponent },
  { path: 'tag-sets', component: TagSetListComponent },
  { path: 'dashboards', component: DashboardListComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
