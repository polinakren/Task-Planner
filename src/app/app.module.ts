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
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
