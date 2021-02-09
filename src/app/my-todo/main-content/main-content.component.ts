import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TaskList } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { faCalendarTimes, faCheckSquare, faMinusSquare, faPenSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { trigger, transition, animate, style } from '@angular/animations';
import { controlNameBinding } from '@angular/forms/src/directives/reactive_directives/form_control_name';
import { getParseErrors } from '@angular/compiler';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
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

  faPlus = faPlus;
  faPenSquare = faPenSquare;
  faMinusSquare = faMinusSquare;
  faCheckSquare = faCheckSquare;
  faCalendarTimes = faCalendarTimes;

  @ViewChildren('btnTaskUpdate') btnTaskUpdate;
  @ViewChildren('detailTaskName') detailTaskName;
  @ViewChildren('inputTaskName') inputTaskName;

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.showCreateTask = false;
    this.taskList$ = this.taskService.getTasks();
    this.alertVisible = false;
    this.showEditTask = false;
    this.activeUpdateBtn = false;
    this.validateMsg = '';

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
        this.taskList$ = this.taskService.getTasks();
        this.form.reset();
      });
    } else {
      this.alertValidate(validated);
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
        this.taskList$ = this.taskService.getTasks();
        this.showEditTask = !this.showEditTask;
        this.btnTaskUpdate.toArray()[i].nativeElement.disabled = true;
        this.detailTaskName.toArray()[i].nativeElement.classList.remove('hidden');
        if(!this.showEditTask) {
          this.inputTaskName.toArray()[i].nativeElement.classList.add('hidden');
        }
      });
    } else {
      this.alertValidate(validated);
    }

  }

  doDeleteTask(id): void {
    const confirmDeleteTxt = 'Are you sure you want to delete this task';
    const confirmDelete = window.confirm(confirmDeleteTxt);

    if(confirmDelete) {
      this.taskService.deleteTask(id).subscribe(resp => {
        this.taskList$ = this.taskService.getTasks();
      });
    }

  }

  closeAlert(): void {
    this.alertVisible = false;
  }

  validateTask(controls): boolean | string {
    if(controls.taskName.status === 'INVALID') {

      const res = Object.keys(controls.taskName.errors).map( errData => {
        switch(errData) {
          case 'required':
            return 'Adding a task is required.';
          case 'minlength':
            return 'Task should be atleast 3 characters.';
          case 'maxlength':
            return 'Allowed task should have 50 characters only.';
        }
      });

      return res[0];
    }

    return true;
  }

  alertValidate(validated): void {
    this.validateMsg = validated;
    this.alertVisible = true;
    
    setTimeout(() => {
      this.alertVisible = false;
    }, 3000);
  }


  // this is temporary solution, think other ways to improve this
  customValidate(value) : String | Boolean {
      if(value === '' || value === undefined) {
        return 'Adding a task is required.';
      } else if (value.length < 3) {
        return 'Task should be atleast 3 characters.';
      } else if (value.length > 50) {
        return 'Allowed task should have 50 characters only.';
      } else {
        return true;
      }
  }

}
