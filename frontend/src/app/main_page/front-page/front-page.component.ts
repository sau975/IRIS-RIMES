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
  month: string = String((new Date().getMonth()+1).toString().length == 1 ? ('0' + (new Date().getMonth()+1)) : (new Date().getMonth()+1));
  year: string = '2024'

  fromDate: Date = new Date();
  toDate: Date = new Date();
  // allDaysInMonth:any[]=[];

  constructor(
    private router: Router,
    private dataService: DataService
    ) {
      // this.setDateMonth();
      // this.getAllDaysInMonth();
    }

  ngOnInit(): void {}

  setFromAndToDate(){
    let data = {
      fromDate: this.fromDate,
      toDate: this.toDate
    }
    this.dataService.setfromAndToDate(JSON.stringify(data));
    // this.getAllDaysInMonth();
  }

  validateDateRange() {
    var fromDate = this.fromDate;
    var toDate = this.toDate

    if (fromDate > toDate) {
        alert('From date cannot be greater than To date');
        this.fromDate = toDate;
    }
  }

  // getAllDaysInMonth() {
  //   this.allDaysInMonth = [];
  //   const currentDate = new Date();
  //   const currentYear = currentDate.getFullYear();
  //   const currentMonth = Number(this.month)-1;

  //   // Set the date to the first day of the month
  //   const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

  //   // Get the last day of the month
  //   const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  //   // Loop through each day of the month
  //   for (let day = firstDayOfMonth.getDate(); day <= lastDayOfMonth.getDate(); day++) {
  //     this.allDaysInMonth.push(day);
  //   }
  // }

}
