import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
  constructor(
    private http: HttpClient
  ) { }

  getTasks(): Observable<any> {
    console.log(environment.apiUrl);
    return this.http.get<any>(`${environment.apiUrl}/task/all`);
  }

  addTask(data: Object): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/task`, data, {headers: this.headers});
  }

  updateTask(id, data: Object): Observable<any> {
   return this.http.patch<any>(`${environment.apiUrl}/task/${id}`, data, {headers: this.headers}); 
  }

  deleteTask(id): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/task/${id}`);
  }
}
