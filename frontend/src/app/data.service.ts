import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'http://localhost:3000'; // Replace with your actual backend API URL

  constructor(private http: HttpClient) {}
  fetchData(): Observable<any> {
    const url = `${this.baseUrl}`+'/districtdep'; // Replace with your actual API endpoint
    return this.http.get(url);
  }
  fetchData1(): Observable<any> {
    const url = `${this.baseUrl}`+'/statedaily'; // Replace with your actual API endpoint
    return this.http.get(url);
  }
  fetchData2(): Observable<any> {
    const url = `${this.baseUrl}`+'/subdivdaily'; // Replace with your actual API endpoint
    return this.http.get(url);
  }
  fetchData3(): Observable<any> {
    const url = `${this.baseUrl}`+'/regiondaily'; // Replace with your actual API endpoint
    return this.http.get(url);
  }
  fetchData4(): Observable<any> {
    const url = `${this.baseUrl}`+'/statenormal'; // Replace with your actual API endpoint
    return this.http.get(url);
  }
  fetchData5(): Observable<any> {
    const url = `${this.baseUrl}`+'/subdivnormal'; // Replace with your actual API endpoint
    return this.http.get(url);
  }
  fetchData6(): Observable<any> {
    const url = `${this.baseUrl}`+'/regionnormal'; // Replace with your actual API endpoint
    return this.http.get(url);
  }
  fetchMasterFile(): Observable<any> {
    const url = `${this.baseUrl}`+'/masterFile'; // Replace with your actual API endpoint
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

  private valueSubject = new BehaviorSubject<string>('');
  public value$ = this.valueSubject.asObservable();

  setValue(newValue: string) {
    this.valueSubject.next(newValue);
  }

}

