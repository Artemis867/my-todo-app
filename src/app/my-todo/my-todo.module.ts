import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTodoComponent } from './my-todo.component';
import { HeaderComponent } from './header/header.component';
import { MainContentComponent } from './main-content/main-content.component';
import { ListComponent } from './list/list.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    MyTodoComponent,
    HeaderComponent,
    MainContentComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  exports: [
    MyTodoComponent
  ]
})
export class MyTodoModule { }
