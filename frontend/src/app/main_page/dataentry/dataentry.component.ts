import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { response } from 'express';

@Component({
  selector: 'app-dataentry',
  templateUrl: './dataentry.component.html',
  styleUrls: ['./dataentry.component.css']
})
export class DataentryComponent {
  showEditPopup: boolean = false;
  editIndex: number | null = null;
  editData = {
    stationname: '',
    stationid: '',
  };


  showPopup: boolean = false;
  message: string | null = null;
  existingstationdata: any[] = [];
  data = {
    field1: '',
    field2: '',
  };

  ngOnInit(): void {
    this.fetchDataFromBackend();
  }
  constructor(
    private dataService: DataService,
    ) {}

    goBack() {
      window.history.back();
    }

  fetchDataFromBackend(): void {
    this.dataService.existingstationdata().subscribe({
      next: value => {
        this.existingstationdata = value;
        console.log(this.existingstationdata[0])
      },
      error: err => console.error('Error fetching data:', err)
    });
  }


  editStation(index: number) {
    this.showEditPopup = true;
    this.editIndex = index;
    this.editData = { ...this.existingstationdata[index] };
  }



  updateData() {
    this.dataService.deleteData(this.existingstationdata[0].stationid).subscribe({
      next: response => {
        console.log('Data deleted successfully:', response);
      },
      error: err => console.error('Error deleting data. Please check the console for details.', err)
    });
    this.editData = {
      stationname: this.editData.stationname,
      stationid: this.editData.stationid,
    };
    if (this.editIndex !== null && this.editIndex >= 0) {
      this.existingstationdata[this.editIndex] = { ...this.editData };
      console.log(this.existingstationdata[this.editIndex])

      this.dataService.updateData(this.existingstationdata[this.editIndex]).subscribe({
        next: response => {
          console.log('Data updated successfully:', response);
        },
        error: err => console.error('Error updating data. Please check the console for details.', err)
      });
      this.showEditPopup = false;
    }
  }



  cancelEdit() {
    this.editData = {
      stationname: this.editData.stationname,
      stationid: this.editData.stationid,
    };
    this.showEditPopup = false;
  }

  deleteStation(index: number) {
    console.log('Deleting station at index:', index);
  }
  Addstation() {
    this.showPopup = true;
  }
  cancelAddStation() {
    this.showPopup = false;
  }
  addData() {
    this.dataService.addData(this.data).subscribe({
      next: response => {
        this.message = response.message;
      },
      error: err => console.error('Error adding data. Please check the console for details.', err)

  });
  window.location.reload();
  this.showPopup = false;
  }
















  // existingstationdata



  // stations: any[] = [{}];
  // isPopupVisible = false;

  // popupField1!: string; // Add more variables for other fields in the popup


  // data = {
  //   field1: '',
  //   field2: '',
  //   field3: '',
  //   field4: '',
  //   field5: '',
  // };
  // message: string | null = null;

  // formattedDate: string;
  // formattedTime : string



  // constructor(private dataService: DataService,) {
  //   // Get the current date
  //   const today = new Date();

  //   // Format the date as per your requirement (e.g., "DD-MM-YY")
  //   this.formattedDate = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  //   const hours = this.padZero(today.getHours());
  //   const minutes = this.padZero(today.getMinutes());
  //   const seconds = this.padZero(today.getSeconds());
  //   this.formattedTime = `${hours}:${minutes}:${seconds}`;
  // }
  // private padZero(value: number): string {
  //   return value < 10 ? `0${value}` : `${value}`;
  // }




  // fetchDataFromBackend(): void {
  //   this.dataService.fetchData().subscribe({
  //     next: value => {
  //       this.fetchedData = value;
  //       this.processFetchedData();
  //     },
  //     error: err => console.error('Error fetching data:', err)
  //   });





  // openNewWindow() {
  //   // Open a new window with the specified URL
  //   const newWindow = window.open('./main_page/popup.html', '_blank', 'width=500,height=500');

  //   // Ensure that the new window is not null
  //   if (newWindow) {
  //     // Focus the new window
  //     newWindow.focus();
  //   }
  // }


  // addData() {
  //   this.dataService.addData(this.stations).subscribe({
  //     next: response => {
  //       this.message = response.message;
  //     },
  //     error: err => console.error('Error adding data. Please check the console for details.', err)

  // });
  // }
  // editStation(index: number) {
  //   // Implement your logic for editing a station
  //   console.log('Editing station at index:', index);
  // }

  // deleteStation(index: number) {
  //   // Implement your logic for deleting a station
  //   console.log('Deleting station at index:', index);
  // }
}


