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

  constructor(private dataService: DataService){
    this.scheduleFunction();
    // this.CreateColumn();
  }
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
      this.clearIndexDB();
      // Reschedule function for the next day
      this.scheduleFunction();
    }, delay);
  }


  clearIndexDB(){
    // Open a connection to the IndexedDB database
    var indexedDB = window.indexedDB;
    var request = indexedDB.open('myDatabase', 1);

    // Handle database opening success
    request.onsuccess = function(event:any) {
        var db = event.target.result;

        // Start a transaction on the object store
        var transaction = db.transaction(["myObjectStore"], "readwrite");
        var objectStore = transaction.objectStore("myObjectStore");

        // Open a cursor to iterate through all items in the object store
        var cursorRequest = objectStore.openCursor();

        cursorRequest.onsuccess = function(event:any) {
            var cursor = event.target.result;
            if (cursor) {
                // Delete the current item
                objectStore.delete(cursor.primaryKey);
                cursor.continue();
            } else {
                console.log("All items deleted from object store");
            }
        };

        cursorRequest.onerror = function(event:any) {
            console.log("Error deleting items from object store");
        };
    };

    // Handle errors
    request.onerror = function(event) {
        console.log("Error opening database");
    };

  }
}
