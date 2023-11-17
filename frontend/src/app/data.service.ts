import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'http://localhost:3000'; // Replace with your actual backend API URL

  constructor(private http: HttpClient) {}

  // addData(data: any): Observable<any> {
  //   const url = `${this.baseUrl}`+'/statecum';
  //   return this.http.post(url, { data });
  // }
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
}
