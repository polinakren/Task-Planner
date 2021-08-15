import { CommonModule } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DataTablesModule } from "angular-datatables";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from './app.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { CalendarComponent } from "./components/calendar/calendar.component";
import { EditFormComponent } from "./components/edit-form/edit-form.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { PageCalendarComponent } from './components/page-calendar/page-calendar.component';
import { PageReportsComponent } from './components/page-reports/page-reports.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TableComponent } from './components/table/table.component';
import { MatButtonModule } from "@angular/material/button";

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  resourceTimelinePlugin,
  timeGridPlugin,
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
    TableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    CommonModule,
    FullCalendarModule,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
