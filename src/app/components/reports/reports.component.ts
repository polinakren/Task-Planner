import {Component, OnInit, ViewChild} from '@angular/core';
import {TasksService} from "../../services/tasks/tasks.service";
import {UsersService} from "../../services/users/users.service";
import {TeamsService} from "../../services/teams/teams.service";
import {Task} from "../../models/tasks";
import {User} from "../../models/users";
import {UsersInfo} from "../../models/usersInfo";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  tasks: Task[] = [];
  users: User[] = [];
  usersInfo: UsersInfo[] = [];
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective | undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private tasksService: TasksService,
    private usersService: UsersService,
    private teamsService: TeamsService) { }

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe(tasks=>{
      this.tasks = tasks;
      this.usersService.getUsers().subscribe(users=>{
        this.users = users;
        for(let i = 0; i < tasks.length; i++){
          this.usersInfo.push({
            team: this.tasks[i].assigneeType,
            assignee: this.users[this.tasks[i].assigneeId-1].title,
            status: this.tasks[i].status ,
            title: this.tasks[i].title,
            dateStr: this.tasks[i].start,
            dateEnd: this.tasks[i].end,
            duration: this.getDuration(this.tasks[i].start, this.tasks[i].end),
            description: this.tasks[i].description
          })
          this.dtTrigger.next();
        }

      })
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getDuration(start: string, end: string): number{
    let startDate = new Date(start);
    let endDate = new Date(end);
    let difference = endDate.getTime() - startDate.getTime()
    return Math.floor(difference / (1000 * 60 * 60 * 24) % 30)
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function () {
        const that = this;
        $('input', this.footer()).on('keyup change', function () {
          // @ts-ignore
          if (that.search() !== this['value']) {

            that
              // @ts-ignore
              .search(this['value'])
              .draw();
          }
        });
      });
    });
  }

  showCurrentWeek(){
    this.datatableElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw()
    })
  }
}
