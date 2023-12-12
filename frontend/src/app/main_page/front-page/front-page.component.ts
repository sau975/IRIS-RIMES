import { Component, OnInit } from '@angular/core';
import 'jspdf-autotable';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit{

  date: string = String(new Date().getDate());
  month: string = String(new Date().getMonth()+1);

  constructor(
    private router: Router,
    private dataService: DataService
    ) {
      // this.setDateMonth();
    }

  ngOnInit(): void {}

  getNormalMap(){
    this.router.navigate(['front-page/normal']);
  }

  getDailyMap(){
    this.router.navigate(['front-page/daily']);
  }

  getDepartureMap(){
    this.router.navigate(['front-page/departure']);
  }

  setDateMonth(){
    let data = {
      date: this.date,
      month: this.month
    }
    this.dataService.setValue(JSON.stringify(data));
  }
}
