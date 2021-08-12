import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { interval } from "rxjs";

@Component({
  selector: "app-edit-form",
  templateUrl: "./edit-form.component.html",
  styleUrls: ["./edit-form.component.css"]
})
export class EditFormComponent implements OnInit {
  formStatus: string = "";
  editForm: FormGroup = new FormGroup ({ firstName: new FormControl(), lastName: new FormControl()});
  interval = interval(3000);

  constructor(private formBuilder: FormBuilder) {
  }

  info = {
    description: "",
    title: "",
    status: ""
  };

  @Input() name: string = "";
  @Input() start: string = "";
  @Input() end: string = "";
  @Input() title: string = "";
  @Input() description: string = "";
  @Input() status: string = "";
  @Input() isDisableToEdit: boolean | undefined;

  @Output() output = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() change = new EventEmitter();

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      title: this.title,
      description: this.description
    });

    this.info.description = this.description;
    this.info.title = this.title;
    this.info.status = this.status;

    this.getStatus();

    this.interval.subscribe((value => {
      this.info.title = this.editForm.get("title")?.value;
      this.info.description = this.editForm.get("description")?.value;
      this.change.next(this.info);
    }));
  }

  getStatus(): void {
    if (this.status === "Not set") {
      this.formStatus = "in progress";
    }
    if (this.status === "In progress") {
      this.formStatus = "done";
    }
    if (this.status === "Done") {
      this.formStatus = "not set";
    }
  }

  restartStatus(): void {
    if (this.status === "Not set") {
      this.status = "In progress";
      this.info.status = "In progress";
      this.getStatus();
      this.change.next(this.info);
    } else if (this.status === "In progress") {
      this.status = "Done";
      this.info.status = "Done";
      this.getStatus();
      this.change.next(this.info);
    } else if (this.status === "Done") {
      this.status = "Not set";
      this.info.status = "Not set";
      this.getStatus();
      this.change.next(this.info);
    }
  }
}
