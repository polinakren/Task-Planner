import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Team } from "../../models/teams";

@Injectable({
  providedIn: "root"
})
export class TeamsService {

  constructor(private http: HttpClient) { }

  getTeams(): Observable<Team[]> {
    return this.http.get("http://localhost:3000/teams").pipe(map((data: any) => {
      return data.map(function (team: Team): Team {
        return new Team(team.id, team.teamId, team.title);
      });
    }));
  }
}
