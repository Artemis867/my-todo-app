import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { TaskList } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { faCheckSquare, faMinusSquare, faPenSquare, faPlus } from '@fortawesome/free-solid-svg-icons';

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

  faPlus = faPlus;
  faPenSquare = faPenSquare;
  faMinusSquare = faMinusSquare;
  faCheckSquare = faCheckSquare;

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

    this.showEditTask = false;
    this.activeUpdateBtn = false;

    this.form = this.fb.group({
      taskName: ['']
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
    this.taskService.addTask(this.form.value).subscribe( resp => {
      this.taskList$ = this.taskService.getTasks();
      this.form.reset();
      this.showCreateTask = false;
    });
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

}
