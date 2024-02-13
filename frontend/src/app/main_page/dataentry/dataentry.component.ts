import { Component, ElementRef } from '@angular/core';
import { DataService } from '../../data.service';
import { response } from 'express';

@Component({
  selector: 'app-dataentry',
  templateUrl: './dataentry.component.html',
  styleUrls: ['./dataentry.component.css']
})
export class DataentryComponent {
  selectedFile: File | null = null;
  rainFallInMM: number = 0;
  todayDate: string;
  showEditPopup: boolean = false;
  showdeletePopup: boolean = false;
  previousstationid: any;
  editData:any = {
    stationname: '',
    stationid: '',
    editIndex : null,
    previousstationid: null
  };
  deleteData:any = {
    stationname: '',
    stationid: '',
    editIndex : null,
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
    ) {
      const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    this.todayDate = yyyy + '-' + mm + '-' + dd;
    }

    goBack() {
      window.history.back();
    }

  fetchDataFromBackend(): void {
    this.dataService.existingstationdata().subscribe({
      next: value => {
        this.existingstationdata = value;
      },
      error: err => console.error('Error fetching data:', err)
    });
  }
  editStation(index: number) {
    this.showEditPopup = true;
    this.editData = { ...this.existingstationdata[index] };
    this.editData.editIndex = index;
    this.editData.previousstationid = this.editData.stationid
    console.log(this.editData, "jjjj")
  }
  deleteStationdata(index: number): void {
    this.showdeletePopup = true;
    this.deleteData = { ...this.existingstationdata[index] };
  }

  updateData() {
    this.editData = {
      stationname: this.editData.stationname,
      stationid: this.editData.stationid,
      editIndex : this.editData.editIndex,
      previousstationid : this.editData.previousstationid
    };
    if (this.editData.editIndex !== null && this.editData.editIndex >= 0) {
      this.existingstationdata[this.editData.editIndex] = { ...this.editData };
      console.log(this.existingstationdata[this.editData.editIndex])

      this.dataService.updateData(this.editData).subscribe({
        next: response => {
          console.log('Data updated successfully:', response);
        },
        error: err => console.error('Error updating data. Please check the console for details.', err)
      });
      this.showEditPopup = false;
    }
  }
  deletestation(){
    this.deleteData = {
      stationname: this.deleteData.stationname,
      stationid: this.deleteData.stationid,
      editIndex : this.deleteData.editIndex,
    };
      this.dataService.deletestation(this.deleteData.stationid).subscribe({
        next: response => {
          console.log('Data deleted successfully:', response);
        },
        error: err => console.error('Error deleted data. Please check the console for details.', err)
      });
      this.showdeletePopup = false;
      window.location.reload();
  }

  cancelEdit() {
    this.editData = {
      stationname: this.editData.stationname,
      stationid: this.editData.stationid,
      editIndex : this.editData.editIndex,
      previousstationid : this.editData.previousstationid
    };
    this.showEditPopup = false;
  }
  canceldelete(){
    this.showdeletePopup = false;
  }
  Addstation() {
    this.showPopup = true;
  }
  cancelAddStation() {
    this.showPopup = false;
  }
  addData(){
    this.dataService.addData(this.data).subscribe({
      next: response => {
        this.message = response.message;
      },
      error: err => console.error('Error adding data. Please check the console for details.', err)
  });
  window.location.reload();
  this.showPopup = false;
  }


  showMessage(elementRef:any){
    if(Number(elementRef.value) > 400){
      elementRef.style.background = 'red'
      alert("Rainfall is greater than 400mm")
    }else{
      elementRef.style.background = ''
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.dataService.uploadFile(this.selectedFile).subscribe(
        (response:any) => {
          alert('File uploaded successfully:' + response);
        },
        (error:any) => {
          alert('Error uploading file:' + error);
        }
      );
    }
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


