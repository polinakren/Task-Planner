import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TasksService} from "../../services/tasks/tasks.service";
import {UsersService} from "../../services/users/users.service";

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  authForm: FormGroup = new FormGroup ({ login: new FormControl()});

  error = '';
  username: string = 'hi';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private tasksService: TasksService,
    private usersService: UsersService,) { }
  onSelected(){
    this.router.navigate(['calendar']);
  }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      login: ''
    })
  }

  onSubmit() {
    this.usersService.getUsers().subscribe(users=>{
      for(let i = 0; i < users.length; i++){
        if(users[i].login == this.authForm.get('login')?.value){
          localStorage.setItem('userName', this.authForm.get('login')?.value)
          this.router.navigate(['/calendar'])
        }
      }
    })
  }
}
