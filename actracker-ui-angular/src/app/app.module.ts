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
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';

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
    DashboardViewComponent,
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
