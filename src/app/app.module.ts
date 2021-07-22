import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FullCalendarModule} from "@fullcalendar/angular";
import { AppComponent } from './app.component';
import {CalendarComponent} from "./components/calendar/calendar.component";
import { HttpClientModule } from '@angular/common/http';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import {EditFormComponent} from "./components/edit-form/edit-form.component";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";
import { AuthorizationComponent } from './components/authorization/authorization.component';
import {AppRoutingModule} from "./app-routing.module";
import { PageCalendarComponent } from './components/page-calendar/page-calendar.component';
import { ReportsComponent } from './components/reports/reports.component';
import { PageReportsComponent } from './components/page-reports/page-reports.component';

import {CommonModule} from "@angular/common";
import {DataTablesModule} from "angular-datatables";

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  resourceTimelinePlugin,
  timeGridPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    EditFormComponent,
    NavbarComponent,
    AuthorizationComponent,
    PageCalendarComponent,
    ReportsComponent,
    PageReportsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FullCalendarModule,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
