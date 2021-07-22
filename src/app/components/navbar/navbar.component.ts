import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../services/users/users.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: string = '';

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private router: Router) { }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe(users=>{
      for(let i = 0; i < users.length; i++){
        if(users[i].login == localStorage.getItem('userName')){
          this.user = users[i].title
        }
      }
    })
  }

  signOut() {
    localStorage.removeItem('userName')
    this.router.navigate(['/'])
  }

  calendarPage() {
    this.router.navigate(['/calendar'])
  }

  reportPage() {
    this.router.navigate(['/reports'])
  }
}
