import { Component, Input, OnInit } from "@angular/core";
import { UsersInfo } from "../../models/usersInfo";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  @Input() usersInfo: UsersInfo[] = [];

  ngOnInit(): void {
  }

}
