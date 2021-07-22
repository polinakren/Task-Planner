import {
  Component, ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import {
  CalendarOptions,
  EventClickArg,
  EventApi,
  EventDropArg,
  DateSelectArg,
  CalendarApi,
  FullCalendarComponent,
} from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {EventResizeDoneArg} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import {TasksService} from "../../services/tasks/tasks.service";
import {UsersService} from "../../services/users/users.service";
import {TeamsService} from "../../services/teams/teams.service";
import {User} from "../../models/users";
import {Task} from "../../models/tasks";
import {EditFormComponent} from "../edit-form/edit-form.component";
import {interval, Subscription} from "rxjs"
import {Team} from "../../models/teams";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild("formContainer", { read: ViewContainerRef }) container: { clear: () => void; createComponent: (arg0: ComponentFactory<any>) => ComponentRef<any> | undefined; } | undefined;
  componentRef!: ComponentRef<any> | undefined;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent | undefined;
  @Input() deleteEvent: boolean = false;

  calendarOptions: CalendarOptions | undefined;
  tasks: Task[] = [];
  users: User[] = [];
  teams: Team[] = [];
  calendarApi: CalendarApi | undefined;
  interval = interval(2000)
  sub: Subscription | undefined
  userId: number | undefined

  constructor(
    private tasksService: TasksService,
    private usersService: UsersService,
    private teamsService: TeamsService,
    private componentFactoryResolver: ComponentFactoryResolver
  ){ }

  ngOnInit(): void {
    this.getUserId(String(localStorage.getItem('userName')))
    this.calendarOptions = {
      aspectRatio: 3,
      businessHours: true,
      dayMaxEvents: true,
      editable: true,
      eventClick: this.handleEventClick.bind(this),
      eventDrop: this.eventDrop.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventResize: this.eventResize.bind(this),
      headerToolbar: {
        left: 'resourceTimelineWeek,resourceTimelineTwoWeeks,resourceTimelineFourWeeks,resourceTimelineEightWeeks prev,next',
        center: 'title',
        right : 'today',
      },
      initialView: 'resourceTimelineWeek',
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimelinePlugin],
      timeZone: 'UTC',
      selectable: true,
      selectMirror: true,
      select: this.handleDateSelect.bind(this),
      weekends: true,

      views: {
        resourceTimelineWeek: {
          type: 'resourceTimeline',
          slotLabelFormat: [
            {weekday: "short", day: "numeric"}
          ],
          duration: { days: 7 },
          slotDuration: {days: 1},
          buttonText: '1 week'
        },
        resourceTimelineTwoWeeks:{
          type: 'resourceTimeline',
          duration: { weeks: 2 },
          slotDuration: {days: 1},
          slotLabelFormat: [
            { month: 'long'},
            { week: "short"},
            {weekday: "narrow"},
          ],
          buttonText: '2 weeks',
        },
        resourceTimelineFourWeeks: {
          type: 'resourceTimeline',
          duration: { weeks: 4 },
          slotDuration: {days: 1},
          buttonText: '4 weeks',
          slotLabelFormat: [
            { month: 'long'},
            { week: "short"},
            {weekday: "narrow"},
          ],
        },
        resourceTimelineEightWeeks: {
          type: 'resourceTimeline',
          duration: { weeks: 8 },
          slotDuration: {days: 1},
          buttonText: '8 weeks',
          slotLabelFormat: [
            { month: 'long'},
            { week: "short"},
            {weekday: "narrow"},
          ],
        },
      },
      resourceAreaHeaderContent: 'Team',
      resourceGroupField: 'team'
    }

    this.getUsers()
    this.getTasks()
    this.getTeams()
  }

  currentEvents: EventApi[] = [];

  getUsers(){
    this.usersService.getUsers().subscribe(users=>{
      this.users = users;
      this.calendarApi = this.getCalendarApi()
      for(let i = 0; i < this.users.length; i++){
        this.calendarApi?.addResource({
          id: String(this.users[i].id),
          teamId: String(this.users[i].teamId),
          login: this.users[i].login,
          title: this.users[i].title,
          eventColor: this.users[i].eventColor,
          durationEditable: true,
          startEditable: true,
          team: this.getGroupName(this.users[i].teamId)
        })
      }
    });

  }

  getTasks() {
    this.tasksService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.calendarApi = this.getCalendarApi()
      for(let i = 0; i < this.tasks.length; i++){
        this.calendarApi?.addEvent({
          type: this.tasks[i].assigneeType,
          resourceId: String(this.tasks[i].assigneeId),
          start: this.tasks[i].start,
          end: this.tasks[i].end,
          title: this.tasks[i].title,
          description: this.tasks[i].description,
          status: this.tasks[i].status,
          id: String(this.tasks[i].id),
          backgroundColor: this.getColor(this.tasks[i].status),
          borderColor: this.getColor(this.tasks[i].status)
        })
      }
    });
  }

  getTeams(){
    this.teamsService.getTeams().subscribe(teams=>{
      this.teams = teams
    })
  }

  // @ts-ignore
  getGroupName(idTeam: number): string{
    if(idTeam == 2){
      return 'Developers'
    }
    if(idTeam == 1){
      return 'Users'
    }
  }

  getCalendarApi() {
    return this.calendarComponent?.getApi()
  }

  getUserId(title: string){
    this.usersService.getUsers().subscribe(users=>{
      for(let i = 0; i < users.length; i++){
        if(title == users[i].login){
          this.userId = users[i].id
        }
      }
    })
  }

  eventDrop(info: EventDropArg){
    if(this.userId != info.event._def.resourceIds){
      info.revert()
    }else {
      this.tasksService.editTask(new Task(this.getTypeOfUser(Number(info.event._def.resourceIds)), Number(info.event._def.resourceIds),
        info.event.startStr, info.event.endStr, info.event.title,
        info.event._def.extendedProps.description, info.event._def.extendedProps.status,
        Number(info.event.id)), Number(info.event.id)).subscribe()
    }

  }

  eventResize(info: EventResizeDoneArg){
    if(this.userId != info.event._def.resourceIds){
      info.revert()
    } else {
      this.tasksService.editTask(new Task(this.getTypeOfUser(Number(info.event._def.resourceIds)), Number(info.event._def.resourceIds),
        info.event.startStr, info.event.endStr, info.event.title,
        info.event._def.extendedProps.description, info.event._def.extendedProps.status, Number(info.event.id)), Number(info.event.id)).subscribe()
      }
    }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.calendarApi = selectInfo.view.calendar;
    this.calendarApi.unselect();
    if(this.userId == selectInfo.resource?.id){
      this.tasksService.addTask(this.getTypeOfUser(Number(selectInfo.resource?.id)), Number(selectInfo.resource?.id), selectInfo.startStr, selectInfo.endStr, '', '', 'Not set').subscribe(task=>{
        this.calendarApi?.addEvent({
          type: task.assigneeType,
          resourceId: String(task.assigneeId),
          start: task.start,
          end: task.end,
          title: task.title,
          description: task.description,
          status: task.status,
          id: String(task.id),
          backgroundColor: '#ababba',
          borderColor: '#ababba'
        })
      })
    }
  }

  getTypeOfUser(id: number): string{
    let teamId = this.users[id-1].teamId
    return this.teams[teamId-1].title
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  handleEventClick(clickInfo: EventClickArg) {
    const id = clickInfo.event.id
    let eventApi = this.calendarApi?.getEventById(String(id))
    const resourceId = Number(clickInfo.event._def.resourceIds)
    const name = this.users[resourceId-1].title
    const start = clickInfo.event.startStr
    const end = clickInfo.event.endStr
    const title = clickInfo.event.title
    const description = clickInfo.event._def.extendedProps.description
    const status = clickInfo.event._def.extendedProps.status

    this.createComponent(name, resourceId, start, end, title, description, status, Number(id))
  }

  delete(id: number){
    this.tasks.splice(id, 1)
    this.currentEvents.splice(id, 1)
    const eventApi = this.calendarApi?.getEventById(String(id))
    eventApi?.remove()
    this.tasksService.deleteTasks(id).subscribe();
  }

  createComponent(userName: string, userId: number, start: string, end: string, title: string, description: string, status: string, id: number) {
    if(this.sub)
    this.sub.unsubscribe()
    if(!this.container){
      return;
    }
    this.container.clear();
    const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(EditFormComponent)
    this.componentRef = this.container?.createComponent(componentFactory)

    if(!this.componentRef){
      return;
    }
    this.componentRef.instance.name = userName
    this.componentRef.instance.title = title
    this.componentRef.instance.description = description
    this.componentRef.instance.status = status
    this.componentRef.instance.start = start
    this.componentRef.instance.end = end

    this.sub = this.interval.subscribe(value => {
      this.tasksService.getTask(id).subscribe(task=>{
        if(!this.componentRef){
          return;
        }
        this.componentRef.instance.start = task.start
        this.componentRef.instance.end = task.end
      })
    })

    this.componentRef.instance.delete.subscribe((event: any) => {
      this.delete(id)
      if(!this.componentRef){
        return;
      }
      this.componentRef.destroy();
    });

    this.componentRef.instance.change.subscribe((info: any) => {
      if(!this.componentRef){
        return;
      }

      const eventApi = this.calendarApi?.getEventById(String(id))
      eventApi?.setProp('title', info.title)
      eventApi?.setExtendedProp('description', String(info.description))
      eventApi?.setExtendedProp('status', String(info.status))
      eventApi?.setProp('backgroundColor', this.getColor(info.status))
      eventApi?.setProp('borderColor', this.getColor(info.status))
      this.tasksService.editTask(new Task(this.getTypeOfUser(userId), userId, this.componentRef.instance.start, this.componentRef.instance.end, info.title, info.description, info.status, id), id).subscribe()
    });
  }


  getColor(status: string): string{
    if(status == "Not set"){
      return "#ababba"
    }
    if(status == "In progress"){
      return "#ffbb8e"
    }
    if(status == "Done"){
      return "#7baa98"
    }
    return "#ababba"
  }
}
