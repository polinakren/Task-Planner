import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthorizationComponent } from "./components/authorization/authorization.component";
import { PageCalendarComponent } from "./components/page-calendar/page-calendar.component";
import { PageReportsComponent } from "./components/page-reports/page-reports.component";

const appRoutes: Routes =[
  { path: "auth", component: AuthorizationComponent },
  { path: "", redirectTo: "/auth", pathMatch: "full" },
  { path: "calendar", component: PageCalendarComponent },
  { path: "reports", component: PageReportsComponent }
];

@NgModule({
  imports: [RouterModule, RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
