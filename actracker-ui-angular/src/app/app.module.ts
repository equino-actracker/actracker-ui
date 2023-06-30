import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthHttpInterceptor } from './auth-http-interceptor';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivityComponent } from './activity/activity.component';
import { LoginComponent } from './login/login.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagComponent } from './tag/tag.component';
import { TagsSelectorComponent } from './tags-selector/tags-selector.component';
import { TagSetListComponent } from './tag-set-list/tag-set-list.component';
import { TagSetComponent } from './tag-set/tag-set.component';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { DashboardDataComponent } from './dashboard-data/dashboard-data.component';
import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActivityFilterComponent } from './activity-filter/activity-filter.component';
import { TagSetCreateComponent } from './tag-set-create/tag-set-create.component';
import { MetricListComponent } from './metric-list/metric-list.component';
import { MetricComponent } from './metric/metric.component';
import { MetricCreateComponent } from './metric-create/metric-create.component';
import { TagCreateComponent } from './tag-create/tag-create.component';
import { ShareListComponent } from './share-list/share-list.component';
import { ShareComponent } from './share/share.component';
import { ShareCreateComponent } from './share-create/share-create.component';
import { ActivityCreateComponent } from './activity-create/activity-create.component';

@NgModule({
  declarations: [
    AppComponent,
    ActivityListComponent,
    ActivityComponent,
    LoginComponent,
    TagListComponent,
    TagComponent,
    TagsSelectorComponent,
    TagSetListComponent,
    TagSetComponent,
    DashboardListComponent,
    DashboardDataComponent,
    DashboardEditComponent,
    DashboardComponent,
    ActivityFilterComponent,
    TagSetCreateComponent,
    MetricListComponent,
    MetricComponent,
    MetricCreateComponent,
    TagCreateComponent,
    ShareListComponent,
    ShareComponent,
    ShareCreateComponent,
    ActivityCreateComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
