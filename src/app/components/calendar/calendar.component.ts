import {
  Component, ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';
import {
  CalendarOptions,
  EventClickArg,
  EventApi,
  EventDropArg,
  EventMountArg,
  DateSelectArg,
  CalendarApi,
  FullCalendarComponent
} from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {EventReceiveArg, EventResizeDoneArg} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import {TasksService} from "../../services/tasks/tasks.service";
import {UsersService} from "../../services/users/users.service";
import {TeamsService} from "../../services/teams/teams.service";
import {User} from "../../models/users";
import {Task} from "../../models/tasks";
import {EditFormComponent} from "../edit-form/edit-form.component";


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
  calendarApi: CalendarApi | undefined;
  tool: MatTooltip | undefined
  isFormOpen : boolean = false

  constructor(
    private tasksService: TasksService,
    private usersService: UsersService,
    private teamsService: TeamsService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ){ }

  ngOnInit(): void {
    this.calendarOptions = {
      initialView: 'resourceTimelineWeek',
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDrop: this.eventDrop.bind(this),
      eventResize: this.eventResize.bind(this),
      //eventDidMount: this.mountEvent.bind(this),

      timeZone: 'UTC',
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimelinePlugin],
      aspectRatio: 3,
      businessHours: true,
      headerToolbar: {
        left: 'resourceTimelineWeek,resourceTimelineTwoWeeks,resourceTimelineFourWeeks,resourceTimelineEightWeeks prev,next',
        center: 'title',
        right : 'today',
      },

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
      //resources: 'http://localhost:3000/users',
    }

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
          startEditable: true
        })
      }

    });

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

  currentEvents: EventApi[] = [];

  getCalendarApi() {
    return this.calendarComponent?.getApi()
  }

  mountEvent(info : EventMountArg){
    // var tooltip = new Tooltip(info.el, {
    //   title: info.event.extendedProps.description,
    //   placement: 'top',
    //   trigger: 'hover',
    //   container: 'body'
    // });
    //this.tool?.position
  }

  eventDrop(info: EventDropArg){
    this.tasksService.editTask(new Task('user', Number(info.event._def.resourceIds),
      info.event.startStr, info.event.endStr, info.event.title,
      info.event._def.extendedProps.description, info.event._def.extendedProps.status, Number(info.event.id)), Number(info.event.id)).subscribe()
  }

  eventResize(info: EventResizeDoneArg){
    this.tasksService.editTask(new Task('user', Number(info.event._def.resourceIds),
      info.event.startStr, info.event.endStr, info.event.title,
      info.event._def.extendedProps.description, info.event._def.extendedProps.status, Number(info.event.id)), Number(info.event.id)).subscribe()
    if(this.isFormOpen){

    }
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.calendarApi = selectInfo.view.calendar;
    console.log(this.calendarApi.getResources())
    this.calendarApi.unselect();

    console.log(this.calendarApi?.getResources())

    this.tasksService.addTask("user", Number(selectInfo.resource?.id), selectInfo.startStr, selectInfo.endStr, '', '', '').subscribe(task=>{
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

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  handleEventClick(clickInfo: EventClickArg) {
    const id = clickInfo.event.id
    let eventApi = this.calendarApi?.getEventById(String(id))
    const resourceId = Number(clickInfo.event._def.resourceIds) - 1
    const name = this.users[resourceId].title
    const start = clickInfo.event.startStr
    const end = clickInfo.event.endStr
    const title = clickInfo.event.title
    const description = clickInfo.event._def.extendedProps.description
    const status = clickInfo.event._def.extendedProps.status

    console.log(clickInfo.event)
    this.createComponent(name, resourceId+1, start, end, title, description, status, Number(id))
  }

  delete(id: number){
    this.tasks.splice(id, 1)
    this.currentEvents.splice(id, 1)
    const eventApi = this.calendarApi?.getEventById(String(id))
    eventApi?.remove()
    this.tasksService.deleteTasks(id).subscribe();
  }

  getUsers(){
    this.usersService.getUsers().subscribe(users=>{
      this.users = users;
      return this.users;
    });
  }

  createComponent(userName: string, userId: number, start: string, end: string, title: string, description: string, status: string, id: number) {
    this.isFormOpen = true
    if(!this.container){
      return;
    }
    this.container.clear();
    const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(EditFormComponent)
    this.componentRef = this.container?.createComponent(componentFactory)

    this.tasksService.getTask(id).subscribe(task=>{
      console.log(task.start, task.end)
    })

    if(!this.componentRef){
      return;
    }
    this.componentRef.instance.name = userName
    this.componentRef.instance.start = start
    this.componentRef.instance.end = end
    this.componentRef.instance.title = title
    this.componentRef.instance.description = description
    this.componentRef.instance.status = status

    this.componentRef.instance.delete.subscribe((event: any) => {
      this.delete(id)
      if(!this.componentRef){
        return;
      }
      this.componentRef.destroy();
    });

    this.componentRef.instance.change.subscribe((info: any) => {
      const eventApi = this.calendarApi?.getEventById(String(id))

      eventApi?.setProp('title', info.title)
      eventApi?.setExtendedProp('description', String(info.description))
      eventApi?.setExtendedProp('status', String(info.status))
      eventApi?.setProp('backgroundColor', this.getColor(info.status))
      eventApi?.setProp('borderColor', this.getColor(info.status))
      this.tasksService.editTask(new Task('user', userId, start, end, info.title, info.description, info.status, id), id).subscribe()
    });
  }

  // @ts-ignore
  getColor(status: string): string{
    if(status == ""){
      return "#ababba"
    }
    if(status == "work"){
      return "#ffbb8e"
    }
    if(status == "done"){
      return "#7baa98"
    }
  }
}
