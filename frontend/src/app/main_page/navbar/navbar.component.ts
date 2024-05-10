import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { IndexedDBService } from 'src/app/indexed-db.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})


export class NavbarComponent implements OnInit {
  isNavbarOpen = false;
  loggedInUser: any;

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }
  showPopup: boolean = false;
  qpfReports: any[] = [];
  rainFallReports: any[] = [];
  designStormReports: any[] = [];

  constructor(
    private router: Router,
    private dataService: DataService,
    private indexedDBService: IndexedDBService
  ) { }


  ngOnInit(): void {
    let loggedInUser: any = localStorage.getItem("isAuthorised");
    this.loggedInUser = JSON.parse(loggedInUser);
    this.dataService.getUploadFiles().subscribe(res => {
      this.qpfReports = res.filter((r: any) => r.section_name == "QPF VERIFICATION REPORT");
      this.rainFallReports = res.filter((r: any) => r.section_name == "RAINFALL REPORTS");
      this.designStormReports = res.filter((r: any) => r.section_name == "DESIGN STORM ANALYSIS");
    })
  }

  downloadPDF(name: string) {
    localStorage.removeItem('weekDates');
    this.dataService.setdownloadPdf(name);
  }

  downloadWeeklyPDF(name: string) {
    this.dataService.setweeklyPdf(name);
    this.weeklyMap();
  }

  goToDailyDepartureMap(name: string) {
    localStorage.removeItem('weekDates');
    this.dailyMap();
    if (name == "District") {
      this.router.navigate(['daily-departure-district-map']);
    }
    if (name == "State") {
      this.router.navigate(['daily-departure-state-map']);
    }
    if (name == "SubDivision") {
      this.router.navigate(['daily-departure-subdivision-map']);
    }
    if (name == "Homogenous") {
      this.router.navigate(['daily-departure-homogenous-map']);
    }
    if (name == "Country") {
      this.router.navigate(['daily-departure-country-map']);
    }
  }

  goToDailyMap(name: string) {
    this.dailyMap();
    if (name == "District") {
      this.router.navigate(['daily-district-map']);
    }
    if (name == "State") {
      this.router.navigate(['daily-state-map']);
    }
    if (name == "SubDivision") {
      this.router.navigate(['daily-subdivision-map']);
    }
    if (name == "Homogenous") {
      this.router.navigate(['daily-homogenous-map']);
    }
  }

  goToNormalMap(name: string) {
    this.dailyMap();
    if (name == "District") {
      this.router.navigate(['normal-district-map']);
    }
    if (name == "State") {
      this.router.navigate(['normal-state-map']);
    }
    if (name == "SubDivision") {
      this.router.navigate(['normal-subdivision-map']);
    }
    if (name == "Homogenous") {
      this.router.navigate(['normal-homogenous-map']);
    }
  }

  goToWeeklyMap(name: string) {
    localStorage.removeItem('dailyDate');
    this.weeklyMap();
    if (name == "District") {
      this.router.navigate(['daily-departure-district-map']);
    }
    if (name == "State") {
      this.router.navigate(['daily-departure-state-map']);
    }
    if (name == "SubDivision") {
      this.router.navigate(['daily-departure-subdivision-map']);
    }
    if (name == "Homogenous") {
      this.router.navigate(['daily-departure-homogenous-map']);
    }
    if (name == "Country") {
      this.router.navigate(['daily-departure-country-map']);
    }
  }

  dailyMap() {
    let date = new Date();
    var data = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      date: date.getDate()
    }
    localStorage.setItem('dailyDate', JSON.stringify(data));
  }

  weeklyMap() {
    const previousWeekWeeklyRange = this.getPreviousWeekWeeklyRange();
    let data = {
      previousWeekWeeklyStartDate: previousWeekWeeklyRange.start.toISOString(),
      previousWeekWeeklyEndDate: previousWeekWeeklyRange.end.toISOString()
    }
    localStorage.setItem('weekDates', JSON.stringify(data));
  }

  getPreviousWeekWeeklyRange() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate the difference between the current day and Thursday (4)
    const daysUntilThursday = (4 - currentDay + 7) % 7;

    // Calculate the start date (Thursday) and end date (Wednesday) of the previous week
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + daysUntilThursday - 7);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    // Calculate the start date (Thursday) and end date (Wednesday) of the week before the previous week
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(startDate.getDate());

    const previousEndDate = new Date(endDate);
    previousEndDate.setDate(endDate.getDate());

    return {
      start: previousStartDate,
      end: previousEndDate,
    };
  }

  uploadPopUp() {
    this.showPopup = true;
  }

  cancel() {
    this.showPopup = false;
  }

  openFile(fileName:any) {
    window.open("assets/" + fileName);
  }

  downloadFile(data:any): void {
    var windo:any = window.open("", "");
    var objbuilder = '';
    objbuilder += ('<embed width=\'100%\' height=\'100%\'  src="data:application/pdf;base64,');
    objbuilder += (data);
    objbuilder += ('" type="application/pdf" />');
    windo.document.write(objbuilder);
    // window.open(`http://localhost:3000/download/${fileId}`, '_blank');
  }

  sendEmail(){
    if (confirm("Do want to send email") == true) {
      // let emails = ["saurav97531@gmail.com", "pavan@rimes.int", "dominic@rimes.int", "tarakesh@rimes.int", "saipraveen@rimes.int", "saurabh@rimes.int"];
      let emails = ["saurav97531@gmail.com"];
      var attachments:any[]=[];
      this.indexedDBService.getAllData().then(response => {
        response.forEach((f:any) => {
          let file = {
            filename: f.filename,
            path: f.base64pdf
          }
          attachments.push(file);
        })
        emails.forEach(email => {
          let data = {
            to: email,
            subject: `Today's Maps and Reports - ${new Date().toDateString()}`,
            text: "Hi This mail is being sent for testing purposes only. PFA",
            attachments: attachments
          }
          this.dataService.sendEmail(data).subscribe(res => {
            console.log("Email Sent Successfully");
          })
        })
      });
    }
  }
}
