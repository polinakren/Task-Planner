import { Injectable } from '@angular/core';
import {User} from "../../models/users"
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get('http://localhost:3000/users').pipe(map((data: any) => {
      return data.map(function (user: any): User {
        return new User(user.id, user.teamId, user.login, user.title, user.eventColor);
      });
    }));
  }
}

