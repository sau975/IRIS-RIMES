import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'http://localhost:3000';

  apiUrl: string = 'http://localhost:3000/api/addData';

  constructor(private http: HttpClient) {}
  addData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, { data });
  }

  fetchData(): Observable<any> {
    const url = `${this.baseUrl}`+'/districtdep';
    return this.http.get(url);
  }
  fetchData1(): Observable<any> {
    const url = `${this.baseUrl}`+'/statedaily';
    return this.http.get(url);
  }
  fetchData2(): Observable<any> {
    const url = `${this.baseUrl}`+'/subdivdaily';
    return this.http.get(url);
  }
  fetchData3(): Observable<any> {
    const url = `${this.baseUrl}`+'/regiondaily';
    return this.http.get(url);
  }
  fetchData4(): Observable<any> {
    const url = `${this.baseUrl}`+'/statenormal';
    return this.http.get(url);
  }
  fetchData5(): Observable<any> {
    const url = `${this.baseUrl}`+'/subdivnormal';
    return this.http.get(url);
  }
  fetchData6(): Observable<any> {
    const url = `${this.baseUrl}`+'/regionnormal';
    return this.http.get(url);
  }
  fetchMasterFile(): Observable<any> {
    const url = `${this.baseUrl}`+'/masterFile';
    return this.http.get(url);
  }

  userLogin(data:any): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/login", data);
  }

  getAuthStatus(){
    var token = localStorage.getItem('isAuthorised');
    if(token){
      return true
    }else{
      return false
    }
  }

}

