import { Component, ElementRef } from '@angular/core';
import { DataService } from '../../data.service';
import { response } from 'express';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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

  showMessage(elementRef: any) {
    const value = elementRef.value.trim(); 
    const regex = /^\d+(\.\d)?$|^\d+(\.\d)?$/; 
    if (regex.test(value)) {
      elementRef.style.background = '';
    } else {
      elementRef.style.background = 'red';
      alert("Please enter a valid number with only one decimal place");
    }

    if(Number(elementRef.value) > 400){
          elementRef.style.background = 'red'
          alert("Rainfall is greater than 400mm")
        }else{
          elementRef.style.background = ''
        }
  }
  
  
  // showMessage(elementRef:any){
  //   if(Number(elementRef.value) > 400){
  //     elementRef.style.background = 'red'
  //     alert("Rainfall is greater than 400mm")
  //   }else{
  //     elementRef.style.background = ''
  //   }
  // }

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

  exportAsXLSX():void {
    this.exportAsExcelFile(this.existingstationdata, 'export-to-excel');
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}


