import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  loggedInUser:any;
  qpfReports:any;
  designStormReports:any;
  rainFallReports:any;


  openFile(e:any) {

  }

  goToDailyDepartureMap(e:any) {

  }

  goToWeeklyMap(e:any) {

  }

  goToDailyMap(e:any){

  }

  goToNormalMap(e:any) {
    
  }

  downloadWeeklyPDF(e:any){

  }

  downloadPDF(e:any) {

  }

  downloadFile(e:any) {

  }

  uploadPopUp() {

  }
}
