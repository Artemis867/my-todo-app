import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MyTodoComponent } from './my-todo/my-todo.component';
import { MyTodoModule } from './my-todo/my-todo.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MyTodoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
