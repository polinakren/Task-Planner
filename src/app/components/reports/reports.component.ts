import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {Task} from "../../models/tasks";
import {Team} from "../../models/teams";
import {User} from "../../models/users";
import {UsersInfo} from "../../models/usersInfo";
import {TasksService} from "../../services/tasks/tasks.service";
import {TeamsService} from "../../services/teams/teams.service";
import {UsersService} from "../../services/users/users.service";
import {TableComponent} from "../table/table.component";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"]
})
export class ReportsComponent implements OnInit {
  tasks: Task[] = [];
  users: User[] = [];
  usersFiltered: string[] = [];
  teams: Team[] = [];
  teamsFiltered: string[] = [];
  tasksInfo: UsersInfo[] = [];
  tasksFiltered: UsersInfo[] = [];
  statusFiltered: string[] = [];

  fromDate: string = "";
  toDate: string = "";
  titleDesc: string = "";
  startDate: string = "";
  endDate: string = "";
  startDuration: number = 0;
  endDuration: number = 10;

  componentRef!: ComponentRef<any> | undefined;
  @ViewChild("tableContainer", {read: ViewContainerRef}) container: {
    clear: () => void;
    createComponent: (arg0: ComponentFactory<any>) => ComponentRef<any> | undefined;
  } | undefined;
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective | undefined;
  dtTrigger: Subject<any> = new Subject<any>();

  isAllTeams: boolean = true;
  isAllUsers: boolean = true;
  isAllStatuses: boolean = true;

  teamsFlags = new Map();
  usersFlags = new Map();
  statusesFlags = new Map();

  constructor(
    private tasksService: TasksService,
    private usersService: UsersService,
    private teamsService: TeamsService,
    private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.usersService.getUsers().subscribe(users => {
        this.users = users;
        for (let i = 0; i < this.users.length; i++)
          this.usersFlags.set(this.users[i].title, true);
        for (let i = 0; i < tasks.length; i++) {
          this.tasksInfo.push({
            team: this.tasks[i].assigneeType,
            assignee: this.users[this.tasks[i].assigneeId - 1].title,
            status: this.tasks[i].status,
            title: this.tasks[i].title,
            dateStr: this.tasks[i].start,
            dateEnd: this.tasks[i].end,
            duration: this.getDuration(this.tasks[i].start, this.tasks[i].end),
            description: this.tasks[i].description
          });
        }
        this.tasksFiltered = this.tasksInfo;
      });
    });
    this.teamsService.getTeams().subscribe(teams => {
      this.teams = teams;
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const difference = endDate.getTime() - startDate.getTime();
    return Math.floor(difference / (1000 * 60 * 60 * 24) % 30);
  }

  showTasks(date: string): void {
    this.setDefaultValuesOfOptions();
    const nowDate: Date = new Date();
    const weekDay = this.getWeekDay(nowDate);
    const startWeek: Date = new Date();
    const endWeek: Date = new Date();

    if (date === "previousWeek") {
      endWeek.setDate(this.getEndOfWeek(nowDate, weekDay));
      startWeek.setDate(this.getEndOfWeek(nowDate, weekDay) - 6);
    }

    if (date === "lastTwoWeeks") {
      endWeek.setDate(this.getEndOfWeek(nowDate, weekDay));
      startWeek.setDate(this.getEndOfWeek(nowDate, weekDay) - 13);
    }

    if (date === "currentWeek") {
      startWeek.setDate(this.getEndOfWeek(nowDate, weekDay) + 1);
      endWeek.setDate(this.getEndOfWeek(nowDate, weekDay) + 7);
    }
    for (let i = 0; i < this.tasksInfo.length; i++) {
      const dateStr = new Date(this.tasksInfo[i].dateStr);
      const dateEnd = new Date(this.tasksInfo[i].dateEnd);
      if (dateStr.getTime() >= startWeek.getTime() && dateStr.getTime() <= endWeek.getTime() || dateEnd.getTime() >= startWeek.getTime() && dateEnd.getTime() <= endWeek.getTime()) {
        this.tasksFiltered.push(this.tasksInfo[i]);
        this.setFlags(i);
      }
    }
    this.fromDate = String(startWeek.toLocaleDateString());
    this.toDate = String(endWeek.toLocaleDateString());
    this.createComponent(this.tasksFiltered);
  }

  setFlags(i: number): void {
    if (this.teamsFiltered.length === 0) {
      this.teamsFiltered.push(this.tasksInfo[i].team);
      this.teamsFlags.set(this.tasksInfo[i].team, true);
    } else {
      if (!this.teamsFiltered.includes(this.tasksInfo[i].team)) {
        this.teamsFiltered.push(this.tasksInfo[i].team);
        this.teamsFlags.set(this.tasksInfo[i].team, true);
      }
    }
    if (this.statusFiltered.length === 0) {
      this.statusFiltered.push(this.tasksInfo[i].status);
      this.statusesFlags.set(this.tasksInfo[i].status, true);
    } else {
      if (!this.statusFiltered.includes(this.tasksInfo[i].status)) {
        this.statusFiltered.push(this.tasksInfo[i].status);
        this.statusesFlags.set(this.tasksInfo[i].status, true);
      }
    }
    if (this.usersFiltered.length === 0) {
      this.usersFiltered.push(this.tasksInfo[i].assignee);
      this.usersFlags.set(this.tasksInfo[i].assignee, true);
    } else {
      if (!this.usersFiltered.includes(this.tasksInfo[i].assignee)) {
        this.usersFiltered.push(this.tasksInfo[i].assignee);
        this.usersFlags.set(this.tasksInfo[i].assignee, true);
      }
    }
  }

  showTasksInBacklog(): void {
    this.tasksFiltered = [];
    this.setDefaultValuesOfOptions();
    const nowDate: Date = new Date();
    const startDate: Date = (new Date());
    startDate.setDate(nowDate.getDate() - 7);
    for (let i = 0; i < this.tasksInfo.length; i++) {
      const dateEnd = new Date(this.tasksInfo[i].dateEnd);
      const dateStr = new Date(this.tasksInfo[i].dateStr);
      if (this.tasksInfo[i].status === "Not set" && dateStr.getTime() <= nowDate.getTime() || dateEnd.getTime() >= startDate.getTime() && dateEnd.getTime() <= nowDate.getTime()) {
        this.tasksFiltered.push(this.tasksInfo[i]);
        this.setFlags(i);
      }
    }
    this.createComponent(this.tasksFiltered);
    this.fromDate = String(startDate.toLocaleDateString());
    this.toDate = String(nowDate.toLocaleDateString());
  }

  showTasksOverdue(): void {
    this.tasksFiltered = [];
    this.setDefaultValuesOfOptions();
    const nowDate: Date = new Date();
    const startDate: Date = (new Date());
    startDate.setDate(nowDate.getDate() - 7);
    for (let i = 0; i < this.tasksInfo.length; i++) {
      const dateEnd = new Date(this.tasksInfo[i].dateEnd);
      const dateStr = new Date(this.tasksInfo[i].dateStr);
      if (this.tasksInfo[i].status === "In progress" && dateStr.getTime() >= startDate.getTime() && dateStr.getTime() <= nowDate.getTime() || dateEnd.getTime() >= startDate.getTime() && dateEnd.getTime() <= nowDate.getTime()) {
        this.tasksFiltered.push(this.tasksInfo[i]);
        this.setFlags(i);
      }
    }
    this.createComponent(this.tasksFiltered);
    this.fromDate = String(startDate.toLocaleDateString());
    this.toDate = String(nowDate.toLocaleDateString());
  }

  showTasksCurrentMonth(): void {
    this.tasksFiltered = [];
    this.setDefaultValuesOfOptions();
    const nowDate: Date = new Date();
    for (let i = 0; i < this.tasksInfo.length; i++) {
      const dateStrMonth = new Date(this.tasksInfo[i].dateStr).getMonth();
      const dateEndMonth = new Date(this.tasksInfo[i].dateEnd).getMonth();
      if (dateStrMonth === nowDate.getMonth() || dateEndMonth === nowDate.getMonth()) {
        this.tasksFiltered.push(this.tasksInfo[i]);
        this.setFlags(i);
      }
    }
    const lastDayOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0);
    this.fromDate = String((new Date(nowDate.getFullYear(), nowDate.getMonth(), 1)).toLocaleDateString());
    this.toDate = String((new Date(nowDate.getFullYear(), nowDate.getMonth(), lastDayOfMonth.getDate())).toLocaleDateString());
    this.createComponent(this.tasksFiltered);
  }

  getEndOfWeek(nowDate: Date, weekDay: string): number {
    if (weekDay === "Monday") {
      return (nowDate.getDate() - 1);
    }
    if (weekDay === "Tuesday") {
      return (nowDate.getDate() - 2);
    }
    if (weekDay === "Wednesday") {
      return (nowDate.getDate() - 3);
    }
    if (weekDay === "Thursday") {
      return (nowDate.getDate() - 4);
    }
    if (weekDay === "Friday") {
      return (nowDate.getDate() - 5);
    }
    if (weekDay === "Saturday") {
      return (nowDate.getDate() - 6);
    }
    if (weekDay === "Sunday") {
      return (nowDate.getDate() - 7);
    }
    return 0;
  }

  getWeekDay(date: Date): string {
    date = date || new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = date.getDay();
    return days[day];
  }

  showInputDate(): void {
    this.tasksFiltered = [];
    const startDate = new Date(this.fromDate);
    const endDate = new Date(this.toDate);
    for (const task of this.tasksInfo) {
      const endDateTask = new Date(task.dateEnd);
      const startDateTask = new Date(task.dateStr);
      if (endDateTask.getTime() <= endDate.getTime() && endDateTask.getTime() >= startDate.getTime() || startDateTask.getTime() <= endDate.getTime() && startDateTask.getTime() >= startDate.getTime()) {
        this.tasksFiltered.push(task);
      }
    }
    this.createComponent(this.tasksFiltered);
  }

  createComponent(usersInfo: UsersInfo[]): void {
    if (!this.container) {
      return;
    }
    this.container.clear();
    const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(TableComponent);
    this.componentRef = this.container?.createComponent(componentFactory);

    if (!this.componentRef) {
      return;
    }
    if (usersInfo.length !== 0) {
      this.componentRef.instance.usersInfo = usersInfo;
    }
  }

  setDefaultValuesOfOptions(): void {
    this.endDate = "";
    this.startDate = "";
    this.toDate = "";
    this.fromDate = "";
    this.titleDesc = "";
    this.endDuration = 10;
    this.startDuration = 0;
    this.tasksFiltered = [];
    this.teamsFiltered = [];
    this.statusFiltered = [];
    this.usersFiltered = [];
    this.teamsFlags.clear();
    this.usersFlags.clear();
    this.statusesFlags.clear();
  }

  allStatusesChanged(isAllStatuses: boolean): void {
    if (isAllStatuses) {
      for (let i = 0; i < this.statusesFlags.size; i++) {
      }
    }
  }

  flagChanged(flag: string): void {
    let tasksWithOptions: UsersInfo[] = [];
    if (flag === "isAllTeams") {
      for (const team of this.teamsFiltered) {
        this.teamsFlags.set(team, this.isAllTeams);
      }
    }
    if (flag === "isAllUsers") {
      for (const user of this.usersFiltered) {
        this.usersFlags.set(user, this.isAllUsers);
      }
    }
    if (flag === "isAllStatuses") {
      for (const status of this.statusFiltered) {
        this.statusesFlags.set(status, this.isAllStatuses);
      }
    }
    if (this.statusesFlags.has(flag)) {
      this.statusesFlags.set(flag, !this.statusesFlags.get(flag));
    }
    if (this.teamsFlags.has(flag)) {
      this.teamsFlags.set(flag, !this.teamsFlags.get(flag));
    }
    if (this.usersFlags.has(flag)) {
      this.usersFlags.set(flag, !this.usersFlags.get(flag));
    }
    tasksWithOptions = this.filterByTeams(this.tasksFiltered);
    tasksWithOptions = this.filterByUsers(tasksWithOptions);
    tasksWithOptions = this.filterByStatuses(tasksWithOptions);
    if (this.titleDesc !== "") {
      tasksWithOptions = this.filterByTitleDesc(tasksWithOptions);
    }
    if (this.startDate !== "" && this.endDate !== "") {
      tasksWithOptions = this.filterByDate(tasksWithOptions);
    }
    tasksWithOptions = this.filterByDuration(tasksWithOptions);
    this.createComponent(tasksWithOptions);
  }

  catchTitleDescInput(): void {
    this.flagChanged("");
  }

  filterByTitleDesc(tasks: UsersInfo[]): UsersInfo[] {
    const tasksFiltered: UsersInfo[] = [];
    if (tasks) {
      for (const task of tasks) {
        if (task.title.includes(this.titleDesc) || task.description.includes(this.titleDesc)) {
          tasksFiltered.push(task);
        }
      }
    }
    return tasksFiltered;
  }

  filterByDate(tasks: UsersInfo[]): UsersInfo[] {
    const tasksFiltered: UsersInfo[] = [];
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    if (tasks) {
      for (const task of tasks) {
        const endDateTask = new Date(task.dateEnd);
        const startDateTask = new Date(task.dateStr);
        if (endDateTask.getTime() <= endDate.getTime() && endDateTask.getTime() >= startDate.getTime() || startDateTask.getTime() <= endDate.getTime() && startDateTask.getTime() >= startDate.getTime()) {
          tasksFiltered.push(task);
        }
      }
    }
    return tasksFiltered;
  }

  filterByDuration(tasks: UsersInfo[]): UsersInfo[] {
    const tasksFiltered: UsersInfo[] = [];
    const start = this.startDuration;
    const end = this.endDuration;
    if (tasks) {
      for (const task of tasks) {
        if (task.duration >= start && task.duration <= end) {
          tasksFiltered.push(task);
        }
      }
    }
    return tasksFiltered;
  }

  filterByTeams(tasks: UsersInfo[]): UsersInfo[] {
    const teamsMap = this.getTeams();
    const tasksFiltered: UsersInfo[] = [];
    if (tasks && teamsMap) {
      for (const task of tasks) {
        if (teamsMap.includes(task.team)) {
          tasksFiltered.push(task);
        }
      }
    }
    return tasksFiltered;
  }

  getTeams(): string[] {
    const teamsMap: string[] = [];
    for (const team of this.teamsFiltered) {
      if (this.teamsFlags.get(team)) {
        teamsMap.push(team);
      }
    }
    return teamsMap;
  }

  getUsers(): string[] {
    const usersMap: string[] = [];
    for (const user of this.usersFiltered) {
      if (this.usersFlags.get(user)) {
        usersMap.push(user);
      }
    }
    return usersMap;
  }

  filterByUsers(tasks: UsersInfo[]): UsersInfo[] {
    const usersMap = this.getUsers();
    const tasksFiltered: UsersInfo[] = [];
    if (tasks && usersMap) {
      for (const task of tasks) {
        if (usersMap.includes(task.assignee)) {
          tasksFiltered.push(task);
        }
      }
    }
    return tasksFiltered;
  }

  getStatuses(): string[] {
    const statusesMap: string[] = [];
    for (const status of this.statusFiltered) {
      if (this.statusesFlags.get(status)) {
        statusesMap.push(status);
      }
    }
    return statusesMap;
  }

  filterByStatuses(tasks: UsersInfo[]): UsersInfo[] {
    const statusesMap = this.getStatuses();
    const tasksFiltered: UsersInfo[] = [];
    if (tasks && statusesMap) {
      for (const task of tasks) {
        if (statusesMap.includes(task.status)) {
          tasksFiltered.push(task);
        }
      }
    }
    return tasksFiltered;
  }
}
