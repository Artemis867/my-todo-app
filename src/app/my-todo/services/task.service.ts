import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
  constructor(
    private http: HttpClient
  ) { }

  getTasks(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/task`);
  }

  addTask(data: Object): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/task`, data, {headers: this.headers});
  }

  updateTask(id, data: Object): Observable<any> {
   return this.http.put<any>(`http://localhost:3000/task/${id}`, data, {headers: this.headers}); 
  }

  deleteTask(id): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/task/${id}`);
  }
}
