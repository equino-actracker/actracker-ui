import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityListComponent } from './activity-list/activity-list.component';


// TODO [mc] visit https://angular.io/tutorial/toh-pt5 to improve routing
const routes: Routes = [
  { path: 'activities', component: ActivityListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
