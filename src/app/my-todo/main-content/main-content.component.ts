import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TaskList } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { faCalendarTimes, faCheckCircle, faCheckSquare,
    faExclamationTriangle, faMinusSquare,
    faPenSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { trigger, transition, animate, style } from '@angular/animations';
import { AlertsComponent } from '../alerts/alerts.component';


const MSG_REQUIRED = 'Adding task is required.';
const MSG_MIN_LENGTH = 'Task should be minimum of 3 characters.';
const MSG_MAX_LENGTH = 'Maximum character of task should be below 50.';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  taskList$: Observable<TaskList>;
  form: FormGroup;
  showCreateTask: Boolean;
  showEditTask: Boolean;
  activeUpdateBtn: Boolean;
  activeInput: String;
  alertVisible: Boolean;
  validateMsg: String | Boolean;
  inputTask: any;
  msgRequired: String;
  msgMinLength: String;
  msgMaxLength: String;
  msgStatus: String;
  alertMsg: String;
  notifySuccess: Boolean;
  notifyFailed: Boolean;

  // fontawesome icons
  faPlus = faPlus;
  faPenSquare = faPenSquare;
  faMinusSquare = faMinusSquare;
  faCheckSquare = faCheckSquare;
  faCalendarTimes = faCalendarTimes;
  
  @ViewChildren('btnTaskUpdate') btnTaskUpdate;
  @ViewChildren('detailTaskName') detailTaskName;
  @ViewChildren('inputTaskName') inputTaskName;
  @ViewChild(AlertsComponent) childAlert: AlertsComponent;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.showCreateTask = false;
    this.taskList$ = this.taskService.getTasks();
    this.showEditTask = false;
    this.activeUpdateBtn = false;
    this.validateMsg = '';

    this.alertVisible = false;

    this.form = this.fb.group({
      taskName: ['',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ]
    });


  }

  toggleCreateTask(): void {
    this.showCreateTask = !this.showCreateTask;
  }

  toggleEditTask(i): void {
    this.showEditTask = !this.showEditTask;
    this.btnTaskUpdate.toArray()[i].nativeElement.classList.remove('hidden');
    this.inputTaskName.toArray()[i].nativeElement.classList.remove('hidden');
    this.detailTaskName.toArray()[i].nativeElement.classList.add('hidden');
  }

  doAddTask(): void {
    const validated = this.validateTask(this.form.controls);

    if(validated === true) {
      this.taskService.addTask(this.form.value).subscribe( resp => {
        const msg = 'Task Added!';
        this.taskList$ = this.taskService.getTasks();
        this.form.reset();

        this.childAlert.alertValidate(msg, true);
      });
    } else {
      this.childAlert.alertValidate(validated, false, true);
    }
  }

  doUpdateTask(id ,i): void {
    this.inputTask = this.inputTaskName.toArray()[i].nativeElement.value;
    const validated = this.customValidate( this.inputTask);

    if(validated === true) {
      const inputValue = {
        taskName: this.inputTaskName.toArray()[i].nativeElement.value
      };

      this.taskService.updateTask(id, inputValue).subscribe(resp => {
        const msg = 'Task updated!';
        this.taskList$ = this.taskService.getTasks();
        this.showEditTask = !this.showEditTask;
        this.btnTaskUpdate.toArray()[i].nativeElement.disabled = true;
        this.detailTaskName.toArray()[i].nativeElement.classList.remove('hidden');
        if(!this.showEditTask) {
          this.inputTaskName.toArray()[i].nativeElement.classList.add('hidden');
        }
        
        this.childAlert.alertValidate(msg, true);
      });
    } else {
      this.childAlert.alertValidate(validated, false, true);
    }

  }

  doDeleteTask(id): void {
    const confirmDeleteTxt = 'Are you sure you want to delete this task';
    this.childAlert.alertConfirm(id);
  }

  doDelete(id): void {
    if(id) {
      this.taskService.deleteTask(id).subscribe(resp => {
        this.taskList$ = this.taskService.getTasks();
      });
    }
  }

  closeAlert(): void {
    this.alertVisible = false;
  }

  validateTask(controls): Boolean | String {
    if(controls.taskName.status === 'INVALID') {

      const res = Object.keys(controls.taskName.errors).map( errData => {
        switch(errData) {
          case 'required':
            return MSG_REQUIRED;
          case 'minlength':
            return MSG_MIN_LENGTH;
          case 'maxlength':
            return MSG_MAX_LENGTH;
        }
      });

      return res[0];
    }

    return true;
  }

  // this is temporary solution, think other ways to improve this
  customValidate(value) : String | Boolean {
      if(value === '' || value === undefined) {
        return MSG_REQUIRED;
      } else if (value.length < 3) {
        return MSG_MIN_LENGTH;
      } else if (value.length > 50) {
        return MSG_MAX_LENGTH;
      } else {
        return true;
      }
  }

}
