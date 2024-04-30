import { filter } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CRIS';
  loadedFeature = 'Departure';
  // emailGroups:any[]=[];
  // emails:any[]=[];

  constructor(
    private dataService: DataService
  ){
    // this.CreateColumn();
    this.scheduleFunction();
    // this.dataService.existingstationdata().subscribe(res => {
    //   let resdata = this.groupByMc(res);
    //   let emaildata:any[]=[];
    //   resdata.forEach(stn => {
    //     stn.mc.forEach((s:any) => {
    //       emaildata.push({station: s.station, rainfall: s[this.dateCalculation()]});
    //     })
    //   })
    //   console.log(this.generateTextFormat(emaildata));
    // })
  }

  // generateTextFormat(data:any): string {
  //   let text = '';
  //   for (let entry of data) {
  //     text += `${entry['station']}: ${entry['rainfall']}mm\n`;
  //   }
  //   return text;
  // }

  // groupByMc(mc:any) {
  //   const groups:any = {};
  //   mc.forEach((station:any) => {
  //     const rmc_mc:any = station.rmc_mc;
  //     if (!groups[rmc_mc]) {
  //       groups[rmc_mc] = [];
  //     }
  //     groups[rmc_mc].push(station);
  //   });
  //   const result = [];
  //   for (const rmc_mc in groups) {
  //     result.push({ rmc_mc: rmc_mc, mc: groups[rmc_mc] });
  //   }
  //   return result;
  // }

  dateCalculation() {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    let newDate = new Date();
    let dd = String(newDate.getDate());
    const year = newDate.getFullYear();
    const currmonth = months[newDate.getMonth()];
    const selectedYear = String(year).slice(-2);
    return `${dd.padStart(2, '0')}_${currmonth}_${selectedYear}`;
  }

  ngOnInit(): void {
    // this.dataService.getEmailGroup().subscribe(res => {
    //   this.emailGroups = res;
    //   this.emailGroups.forEach(x => {
    //     JSON.parse(x.emails).forEach((j:any) => {
    //       this.emails.push(j);
    //     })
    //   })
    // })
  }

  onNavigate(feature:string){
    this.loadedFeature = feature;
  }

  // sendEmail(){
  //   // if (confirm("Do want to send email") == true) {
  //     // let emails = ["saurav97531@gmail.com", "pavan@rimes.int", "dominic@rimes.int", "tarakesh@rimes.int", "saipraveen@rimes.int", "saurabh@rimes.int"];

  //     this.emails.forEach(email => {
  //       let data = {
  //         to: email,
  //         subject: `Rainfall data not received for - ${new Date().toDateString()}`,
  //         text: `Hi Rainfall data not received for - ${new Date().toDateString()} please enter data. Note: This mail is being sent for testing purposes only.`,
  //       }
  //       this.dataService.sendEmail(data).subscribe(res => {
  //         console.log("Email Sent Successfully");
  //       })
  //     })
  //   // }
  // }

  CreateColumn(){
    this.dataService.addColumn({date:this.dateCalculation()}).subscribe(res => {
      console.log("Column Created Successfully");
    })
    this.dataService.addColumnForDailyData({date:this.dateCalculation()}).subscribe(res => {
      console.log("Column Created Successfully");
    })
  }

  scheduleFunction() {
    // Get current time
    var now = new Date();
    // Set desired time (in this case, 11:00 AM)
    var desiredTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0, 0, 0);
    var delay = desiredTime.getTime() - now.getTime();

    if (delay < 0) {
        // If it's already past the desired time, schedule it for tomorrow
        desiredTime.setDate(desiredTime.getDate() + 1);
        delay = desiredTime.getTime() - now.getTime();
    }

    setTimeout(() => {
      this.CreateColumn();
      // Reschedule function for the next day
      this.scheduleFunction();
    }, delay);
  }
}
