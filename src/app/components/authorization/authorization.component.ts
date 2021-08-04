import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { TasksService } from "../../services/tasks/tasks.service";
import { UsersService } from "../../services/users/users.service";

@Component({
  selector: "app-authorization",
  templateUrl: "./authorization.component.html",
  styleUrls: ["./authorization.component.css"]
})
export class AuthorizationComponent implements OnInit {

  authForm: FormGroup = new FormGroup ({ login: new FormControl()});

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private tasksService: TasksService,
    private usersService: UsersService,) { }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      login: ""
    });
  }

  onSubmit() {
    this.usersService.getUsers().subscribe(users => {
      for (const user of users) {
        if (user.login === this.authForm.get("login")?.value) {
          localStorage.setItem("userName", this.authForm.get("login")?.value);
          this.router.navigate(["/calendar"]);
        }
      }
    });
  }
}
