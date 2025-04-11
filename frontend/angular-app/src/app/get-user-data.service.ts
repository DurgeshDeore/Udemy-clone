import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type userData = {
  "name": string,
  "email": string,
  "password": string,
}
@Injectable({
  providedIn: 'root'
})
export class GetUserDataService {
  private apiurl = 'http://localhost:4020/userdata';
  constructor(private http: HttpClient) { }
  getUserData() {
    const url = 'http://localhost:4020/userdata'
    return this.http.get(url);
  }
}
