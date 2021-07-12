import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {interval} from "rxjs"
import {timeInterval} from "rxjs/operators";

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit {
  formStatus: string = ""
  exampleForm: FormGroup = new FormGroup ({ firstName: new FormControl(), lastName: new FormControl()});
  interval = interval(3000)

  constructor(private formBuilder: FormBuilder) {
  }

  info = {
    description: "",
    title: "",
    status: ""
  };

  @Input() name: string = "";
  @Input() start : string = "";
  @Input() end : string = "";
  @Input() title : string = "";
  @Input() description : string = "";
  @Input() status: string = ""

  @Output() output = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() change = new EventEmitter();

  ngOnInit(): void {
    this.exampleForm = this.formBuilder.group({
      title: this.title,
      description: this.description
    });

    this.info.description = this.description
    this.info.title = this.title

    this.getStatus()

    this.interval.subscribe((value => {
      this.info.title = this.exampleForm.get('title')?.value
      this.info.description = this.exampleForm.get('description')?.value
      this.change.next(this.info)
    }))
  }

  getStatus(){
    if(this.status == ""){
      this.formStatus = "In progress"
    }
    if(this.status == "work"){
      this.formStatus = "done"
    }
    if(this.status == "done"){
      this.formStatus = "not set"
    }
    if(this.status == "not set"){
      this.formStatus = ""
    }
  }

  restartStatus() {
    if(this.formStatus == "In progress"){
      this.formStatus = "done"
      this.info.status = "work"
      this.change.next(this.info)
    } else if(this.formStatus == "done"){
      this.formStatus = "not set"
      this.info.status = "done"
      this.change.next(this.info)
    } else if(this.formStatus == "not set"){
      this.formStatus = "In progress"
      this.info.status = ""
      this.change.next(this.info)
    }
  }
}
