import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-deleted-station-log',
  templateUrl: './deleted-station-log.component.html',
  styleUrls: ['./deleted-station-log.component.css']
})
export class DeletedStationLogComponent implements OnInit {

  deletedStationLogs:any[] = [];

  constructor(
    private dataService: DataService
  ){}

  ngOnInit(): void {
    this.dataService.getDeletedStationLog().subscribe(res => {
      this.deletedStationLogs = res.filter((x:any) => x.type != "Report Uploaded");
    })
  }

  goBack() {
    window.history.back();
  }

}
