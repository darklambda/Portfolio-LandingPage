import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {


  constructor(private http: HttpClient) { }

  get_plots() {
  
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': environment.API_URL
    });
    return this.http.get<Object>(environment.API_URL + '/plots', {headers: httpHeaders});
  }
}
