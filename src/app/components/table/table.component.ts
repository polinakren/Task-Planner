import { Component, Input, OnInit } from "@angular/core";
import { TasksInfo } from "../../models/tasksInfo";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  @Input() usersInfo: TasksInfo[] = [];

  ngOnInit(): void {
  }

}
