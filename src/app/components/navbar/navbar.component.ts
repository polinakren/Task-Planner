import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "../../services/users/users.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  user: string = "";

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private router: Router) { }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(users => {
      for (const user of users) {
        if (user.login === localStorage.getItem("userName")) {
          this.user = user.title;
        }
      }
    });
  }

  signOut(): void {
    localStorage.removeItem("userName");
    this.router.navigate(["/"]);
  }

  calendarPage(): void {
    this.router.navigate(["/calendar"]);
  }

  reportPage(): void {
    this.router.navigate(["/reports"]);
  }
}
