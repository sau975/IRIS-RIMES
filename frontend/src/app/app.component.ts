import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CRIS';
  loadedFeature = 'Departure';

  constructor(
    private dataService: DataService
  ){
    this.scheduleFunction();
  }

  onNavigate(feature:string){
    this.loadedFeature = feature;
  }

  sendEmail(){
    // if (confirm("Do want to send email") == true) {
      // let emails = ["saurav97531@gmail.com", "pavan@rimes.int", "dominic@rimes.int", "tarakesh@rimes.int", "saipraveen@rimes.int", "saurabh@rimes.int"];
      let emails = ["saurav97531@gmail.com"];
      emails.forEach(email => {
        let data = {
          to: email,
          subject: `Rainfall data not received for - ${new Date().toDateString()}`,
          text: `Hi Rainfall data not received for - ${new Date().toDateString()} please enter data. Note: This mail is being sent for testing purposes only.`,
        }
        this.dataService.sendEmail(data).subscribe(res => {
          console.log("Email Sent Successfully");
        })
      })
    // }
  }

  scheduleFunction() {
    // Get current time
    var now = new Date();
    // Set desired time (in this case, 11:00 AM)
    var desiredTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
    var delay = desiredTime.getTime() - now.getTime();

    if (delay < 0) {
        // If it's already past the desired time, schedule it for tomorrow
        desiredTime.setDate(desiredTime.getDate() + 1);
        delay = desiredTime.getTime() - now.getTime();
    }

    setTimeout(() => {
      let autoEmailOnOff = JSON.parse(localStorage.getItem('autoEmail') as any);
      if(autoEmailOnOff == true){
        this.sendEmail();
      }
      // Reschedule function for the next day
      this.scheduleFunction();
    }, delay);
  }
}
