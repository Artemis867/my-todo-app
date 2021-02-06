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
    this.btnTaskUpdate.toArray()[i].nativeElement.disabled = false;
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
      this.validateMsg = validated;
      this.alertVisible = true;
      
      setTimeout(() => {
        this.alertVisible = false;
      }, 3000);
    }
  }

  doUpdateTask(id ,i): void {
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

}
