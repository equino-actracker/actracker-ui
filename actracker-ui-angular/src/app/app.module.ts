import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DiagnosticsComponent } from './diagnostics/diagnostics.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthHttpInterceptor } from './auth-http-interceptor';
import { PlanEditorComponent } from './plan-editor/plan-editor.component';
import { PlanListComponent } from './plan-list/plan-list.component';
import { ActivityEditorComponent } from './activity-editor/activity-editor.component';
import { ActivityListComponent } from './activity-list/activity-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DiagnosticsComponent,
    PlanEditorComponent,
    PlanListComponent,
    ActivityEditorComponent,
    ActivityListComponent,
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
