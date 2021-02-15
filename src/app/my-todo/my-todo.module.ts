import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTodoComponent } from './my-todo.component';
import { HeaderComponent } from './header/header.component';
import { MainContentComponent } from './main-content/main-content.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertsComponent } from './alerts/alerts.component';

@NgModule({
  declarations: [
    MyTodoComponent,
    HeaderComponent,
    MainContentComponent,
    AlertsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule
  ],
  exports: [
    MyTodoComponent
  ]
})
export class MyTodoModule { }
