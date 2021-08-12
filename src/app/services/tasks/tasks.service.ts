import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Task } from "../../models/tasks";

@Injectable({
  providedIn: "root"
})
export class TasksService {

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get("http://localhost:3000/tasks").pipe(map((data: any) => {
      return data.map(function (task: Task): Task {
        return new Task(task.assigneeType, task.assigneeId, task.start, task.end, task.title, task.description, task.status, task.id);
      });
    }));
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>("http://localhost:3000/tasks/" + id);
  }

  deleteTasks(id: number): Observable<Task> {
    return this.http.delete<Task>("http://localhost:3000/tasks/" + id);
  }

  addTask(assigneeType: string, assigneeId: number, start: string, end: string, title: string, description: string, status: string): Observable<Task> {
    const task = new Task(assigneeType, assigneeId, start, end, title, description, status, Number(""));
    return this.http.post<Task>("http://localhost:3000/tasks", task);
  }

  editTask(task: Task, id: number):  Observable<Task> {
    return this.http.put<Task>("http://localhost:3000/tasks/" + id, task);
  }
}
