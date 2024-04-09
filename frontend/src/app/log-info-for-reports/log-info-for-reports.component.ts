import { filter } from 'rxjs';
import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-log-info-for-reports',
  templateUrl: './log-info-for-reports.component.html',
  styleUrls: ['./log-info-for-reports.component.css']
})
export class LogInfoForReportsComponent {

  reportsLogs:any[] = [];

  constructor(
    private dataService: DataService
  ){}

  ngOnInit(): void {
    this.dataService.getDeletedStationLog().subscribe(res => {
      this.reportsLogs = res.filter((x:any) => x.type == "Report Uploaded");
    })
  }

  goBack() {
    window.history.back();
  }

}
