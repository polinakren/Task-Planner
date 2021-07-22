import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Team} from "../../models/teams";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private http: HttpClient) { }

  getTeams(): Observable<Team[]> {
    return this.http.get('http://localhost:3000/teams').pipe(map((data: any) => {
      return data.map(function (team: any): Team {
        return new Team(team.id, team.teamId, team.title);
      });
    }));
  }
}
