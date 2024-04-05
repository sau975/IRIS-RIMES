import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('rainfallFileInput') rainfallFileInput!: ElementRef;
  selectedRegion: string[] = [];
  selectedState: string[] = [];
  selectedDistrict: string[] = [];
  regionList: any[] = [];
  filteredStates: any[] = [];
  filteredDistricts: any[] = [];
  filteredStations: any[] = [];
  selectedDate: Date = new Date();
  selectedFile: File | null = null;
  selectedRainfallFile: File | null = null;
  rainFallInMM: number = 0;
  todayDate: string;
  showEditPopup: boolean = false;
  showdeletePopup: boolean = false;
  previousstationid: any;
  editData: any = {
    stationname: '',
    stationid: '',
    dateTime: '',
    stationType: '',
    newOrOld: '',
    lat: '',
    lng: '',
    activationDate: '',
    editIndex: null,
    previousstationid: null
  };
  deleteData: any = {
    stationname: '',
    stationid: '',
    editIndex: null,
  };
  mcdata = [
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"}
  ]

  showPopup: boolean = false;
  message: string | null = null;
  existingstationdata: any[] = [];
  data = {
    stationName: '',
    stationId: '',
    dateTime: new Date(),
    stationType: 'aws',
    newOrOld: 'new',
    lat: '',
    lng: '',
    activationDate: this.selectedDate
  };
  minDate: string = '';
  loggedInUserObject: any;

  ngOnInit(): void {
    this.fetchDataFromBackend();
  }
  constructor(
    private dataService: DataService,
  ) {
    let loggedInUser: any = localStorage.getItem("isAuthorised");
    this.loggedInUserObject = JSON.parse(loggedInUser);
    if(this.loggedInUserObject.data[0].mcorhq == 'mc'){
      const todayDate = new Date();
      todayDate.setDate(todayDate.getDate() - 29);
      this.minDate = this.formatDate(todayDate);
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    this.todayDate = yyyy + '-' + mm + '-' + dd;
  }

  onChangeDate(value:any){
    this.selectedDate = value;
    this.clearRainfallFileInput();
  }

  onChangeRegion(checkedValues:any){
    this.selectedRegion = checkedValues;
    let tempStates = this.existingstationdata.filter(item => {
      return checkedValues.some((value:any) => {
        return item.region == value;
      });
    });
    let tempfilteredStates = Array.from(new Set(tempStates.map(a => a.state)));
    this.filteredStates = tempfilteredStates.map(a => { return {name: a}});
  }

  onChangeState(checkedValues:any){
    this.selectedState = checkedValues;
    let tempDistricts = this.existingstationdata.filter(item => {
      return checkedValues.some((value:any) => {
        return item.state == value;
      });
    })
    let tempfilteredDistricts = Array.from(new Set(tempDistricts.map(a => a.district)));
    this.filteredDistricts = tempfilteredDistricts.map(a => { return {name: a}});
  }

  onChangeDistrict(checkedValues:any){
    let tempStations = this.existingstationdata.filter(item => {
      return checkedValues.some((value:any) => {
        return item.district == value;
      });
    })
    this.filteredStations = Array.from(new Set(tempStations.map(a => a.station)));
  }
  shareCheckedList(item:any[]){
    console.log(item);
  }
  shareIndividualCheckedList(item:any){
    console.log(item);
  }

  goBack() {
    window.history.back();
  }

  dateCalculation() {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    let newDate = new Date(this.selectedDate);
    let dd = String(newDate.getDate());
    const year = newDate.getFullYear();
    const currmonth = months[newDate.getMonth()];
    const selectedYear = String(year).slice(-2);
    return `${dd.padStart(2, '0')}_${currmonth}_${selectedYear}`;
  }
  fetchDataFromBackend(): void {
    this.dataService.existingstationdata().subscribe({
      next: (value) => {
        this.existingstationdata = value;
        let regionList = Array.from(new Set(this.existingstationdata.map(a => a.region)));
        this.regionList = regionList.map(x => {
          return {name: x}
        })
        this.filterByDate();
      },
      error: (err) => console.error('Error fetching data:', err),
    });
  }

  filterByDate() {
    if(this.filteredStations && this.filteredStations.length > 0){
      this.filteredStations = this.existingstationdata.filter(item => {
        return this.filteredStations.some((value:any) => {
          return item.station == value;
        });
      })
    }
    else if(this.selectedState && this.selectedState.length > 0){
      this.filteredStations = this.existingstationdata.filter(item => {
        return this.selectedState.some((value:any) => {
          return item.state == value;
        });
      })
    }
    else if(this.selectedRegion && this.selectedRegion.length > 0){
      this.filteredStations = this.existingstationdata.filter(item => {
        return this.selectedRegion.some((value:any) => {
          return item.region == value;
        });
      })
    }
  }

  editStation(station: any) {
    this.showEditPopup = true;
    this.editData.stationname = station.stationname,
      this.editData.stationid = station.stationid,
      this.editData.dateTime = this.selectedDate,
      this.editData.stationType = station.stationtype,
      this.editData.newOrOld = station.neworold,
      this.editData.lat = station.lat,
      this.editData.lng = station.lng,
      this.editData.activationDate = station.activationdate,
      this.editData.previousstationid = station.stationid
    console.log(this.editData, "jjjj")
  }
  deleteStationdata(index: number): void {
    this.showdeletePopup = true;
    this.deleteData = { ...this.existingstationdata[index] };
  }

  updateData() {
    this.dataService.updateData(this.editData).subscribe({
      next: response => {
        this.fetchDataFromBackend();
        console.log('Data updated successfully:', response);
      },
      error: err => console.error('Error updating data. Please check the console for details.', err)
    });
    this.showEditPopup = false;
    // }
  }
  deletestation() {
    this.deleteData = {
      stationname: this.deleteData.stationname,
      stationid: this.deleteData.stationid,
      editIndex: this.deleteData.editIndex,
    };
    this.dataService.deletestation(this.deleteData.stationid).subscribe({
      next: response => {
        let loggedInUser: any = localStorage.getItem("isAuthorised");
        let parseloggedInUser = JSON.parse(loggedInUser);
        let data = {
          stationName: this.deleteData.stationname,
          stationId: this.deleteData.stationid,
          dateTime: new Date(),
          userName: parseloggedInUser.data[0].name,
          type: "Deleted"
        }
        this.dataService.addDeletedAndCreatedStationLogData(data).subscribe(res => {
          console.log('Log created successfully:', response);
        })
        console.log('Data deleted successfully:', response);
      },
      error: err => console.error('Error deleted data. Please check the console for details.', err)
    });
    this.showdeletePopup = false;
  }

  cancelEdit() {
    this.editData = {
      stationname: this.editData.stationname,
      stationid: this.editData.stationid,
      editIndex: this.editData.editIndex,
      previousstationid: this.editData.previousstationid
    };
    this.showEditPopup = false;
  }
  canceldelete() {
    this.showdeletePopup = false;
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
        let loggedInUser: any = localStorage.getItem("isAuthorised");
        let parseloggedInUser = JSON.parse(loggedInUser);
        let data = {
          stationName: this.data.stationName,
          stationId: this.data.stationId,
          dateTime: new Date(),
          userName: parseloggedInUser.data[0].name,
          type: "Added"
        }
        this.dataService.addDeletedAndCreatedStationLogData(data).subscribe(res => {
          console.log('Log created successfully:', response);
        })
        console.log('Data deleted successfully:', response);
        this.message = response.message;
        alert("Station added successfully");
      },
      error: err => console.error('Error adding data. Please check the console for details.', err)
    });
    // window.location.reload();
    this.showPopup = false;
  }

  showMessage(elementRef: any) {
    const value = elementRef.value.trim();
    const regex = /^\d+(\.\d)?$|^\d+(\.\d)?$/;
    if (regex.test(value)) {
      elementRef.style.background = '';
    } else {
      elementRef.style.background = 'red';
      // alert("Please enter a valid number with only one decimal place");
    }
    if (Number(elementRef.value) > 400) {
      elementRef.style.background = 'red'
      alert("Rainfall is greater than 400mm")
    } else {
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

  submit() {
    let data = {
      date: this.dateCalculation(),
      updatedstationdata: this.filteredStations
    }
    this.dataService.updateRainFallData(data).subscribe(res => {
      alert("Updated")
      this.fetchDataFromBackend();
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.dataService.uploadStationDataFile(this.selectedFile).subscribe(
        (response: any) => {
          alert('File uploaded successfully');
          this.clearFileInput();
          this.filterByDate();
        },
        (error: any) => {
          alert('Error uploading file:' + error);
        }
      );
    }else{
      alert('Please choose file:');
    }
  }

  clearFileInput(): void {
    // Reset the value of the file input element
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onRainfallFileSelected(event: any) {
    this.selectedRainfallFile = event.target.files[0];
    this.readExcel();
  }

  readExcel(): void {
    if(this.selectedRainfallFile){
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData:any = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          if(!jsonData[0].hasOwnProperty(this.dateCalculation())){
            alert("Please select correct date")
            this.clearRainfallFileInput();
          }
      };
      fileReader.readAsArrayBuffer(this.selectedRainfallFile);
    }
  }

  uploadRainFallFile() {
    if (this.selectedRainfallFile) {
      this.dataService.uploadRainFallDataFile(this.selectedRainfallFile, this.dateCalculation()).subscribe(
        (response: any) => {
          alert('File uploaded successfully');
          this.clearRainfallFileInput();
          this.filterByDate();
        },
        (error: any) => {
          alert('Error uploading file:' + error);
        }
      );
    }else{
      alert('Please choose file:');
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  clearRainfallFileInput(): void {
    // Reset the value of the file input element
    if (this.rainfallFileInput) {
      this.rainfallFileInput.nativeElement.value = '';
    }
  }

  downloadRainfallSampleFile(){
    window.open('/assets/rainfall_sample_file.xlsx', '_blank');
  }

  downloadStationSampleFile(){
    window.open('/assets/station_sample_file.csv', '_blank');
  }

  exportAsXLSX(): void {
    this.exportAsExcelFile(this.filteredStations, 'export-to-excel');
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet', worksheet);
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


