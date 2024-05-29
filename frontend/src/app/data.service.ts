import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private baseUrl = 'http://203.156.108.107:3000';
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
  addData(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/addData', {data});
  }

  updateData(data: any): Observable<any> {
    return this.http.put<any>(this.baseUrl+'/updateexistingstationdata', {data});
  }
  verifiedRainfallData(data: any): Observable<any> {
    return this.http.put<any>(this.baseUrl+'/verifiedrainfall', {data});
  }
  addColumn(data: any): Observable<any> {
    return this.http.put<any>(this.baseUrl+'/addcolumn', {data});
  }
  addColumnForDailyData(data: any): Observable<any> {
    return this.http.put<any>(this.baseUrl+'/addcolumnfordailydata', {data});
  }
  updateRainFallData(data: any): Observable<any> {
    return this.http.put<any>(this.baseUrl+'/updaterainfall', {data});
  }
  deletestation(stationId: string): Observable<any> {
    const url = `${this.baseUrl}/deleteexistingstationdata`;
    return this.http.delete<any>(url, { body: { data: stationId } });
  }
  existingstationdata(): Observable<any> {
    const url = `${this.baseUrl}`+'/existingstationdata';
    return this.http.get(url);
  }
  fetchData(): Observable<any> {
    const url = `${this.baseUrl}`+'/districtdep';
    return this.http.get(url);
  }
  // fetchData1(): Observable<any> {
  //   const url = `${this.baseUrl}`+'/statedaily';
  //   return this.http.get(url);
  // }
  // fetchData2(): Observable<any> {
  //   const url = `${this.baseUrl}`+'/subdivdaily';
  //   return this.http.get(url);
  // }
  // fetchData3(): Observable<any> {
  //   const url = `${this.baseUrl}`+'/regiondaily';
  //   return this.http.get(url);
  // }
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
  fetchData7(): Observable<any> {
    const url = `${this.baseUrl}`+'/countrynormal';
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
  private valueSubject = new BehaviorSubject<string>('');
  public value$ = this.valueSubject.asObservable();
  setValue(newValue: string) {
    this.valueSubject.next(newValue);
  }

  private downloadPdfSubject = new BehaviorSubject<string>('');
  public downloadPdf$ = this.downloadPdfSubject.asObservable();
  setdownloadPdf(newdownloadPdf: string) {
    this.downloadPdfSubject.next(newdownloadPdf);
  }

  private weeklyPdfSubject = new BehaviorSubject<string>('');
  public weeklyPdf$ = this.weeklyPdfSubject.asObservable();
  setweeklyPdf(newweeklyPdf: string) {
    this.weeklyPdfSubject.next(newweeklyPdf);
  }

  private fromAndToDateSubject = new BehaviorSubject<string>('');
  public fromAndToDate$ = this.fromAndToDateSubject.asObservable();
  setfromAndToDate(newfromAndToDate: string) {
    this.fromAndToDateSubject.next(newfromAndToDate);
  }

  uploadFile(data:any) {
    return this.http.post(this.baseUrl + '/upload', data);
  }

  uploadStationDataFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + '/uploadstationdata', formData);
  }

  uploadRainFallDataFile(file: File, date:string) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('date', date);
    return this.http.post(this.baseUrl + '/uploadrainfalldata', formData);
  }

  getUploadFiles(): Observable<any> {
    const url = `${this.baseUrl}`+'/uploadedfiles';
    return this.http.get(url);
  }

  addDeletedAndCreatedStationLogData(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/deletedstationlog', {data});
  }

  getDeletedStationLog(): Observable<any> {
    const url = `${this.baseUrl}`+'/deletedstationlog';
    return this.http.get(url);
  }

  sendEmail(emailData: any): Observable<any> {
    console.log(emailData, "-------")
    return this.http.post(this.baseUrl+'/send-email', emailData);
  }

  emailLog(): Observable<any> {
    const url = `${this.baseUrl}`+'/emaillog';
    return this.http.get(url);
  }

  createEmailGroup(data: any): Observable<any> {
    return this.http.post(this.baseUrl+'/emailgroup', data);
  }

  getEmailGroup(): Observable<any> {
    const url = `${this.baseUrl}`+'/emailgroup';
    return this.http.get(url);
  }

  // this API to update the data of defined email group
  upddateDataEmailgroup(id: number, data: any): Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/email-dissemination/defined-email/${id}`, data);
  }
 
  // this API for to delete the group of email
  deleteEntry(id: number): Observable<any>{
    const url = `${this.baseUrl}/email-dissemination/defined-email`;
    return this.http.delete<any>(url, { body: { data: id } });
  }
  // filtered Email log
   getEmailLogs(date: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/email-dissemination/email-log?date=${date}`);
  }
}

