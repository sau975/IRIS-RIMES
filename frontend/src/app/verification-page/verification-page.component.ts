import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-verification-page',
  templateUrl: './verification-page.component.html',
  styleUrls: ['./verification-page.component.css']
})
export class VerificationPageComponent {
  selectedRegion: string = '';
  selectedState: string = '';
  selectedDistrict: string = '';
  regionList:any[]=[];
  filteredStates:any[]=[];
  filteredDistricts:any[]=[];
  filteredStations:any[]=[];
  selectedDate: Date = new Date();
  selectedFile: File | null = null;
  rainFallInMM: number = 0;
  todayDate: string;
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
  verifiedDate: string = '';
  verifiedMessage: string = '';
  status: string = '';

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

    onChangeRegion(){
      let tempStates = this.existingstationdata.filter(s => s.region == this.selectedRegion);
      this.filteredStates = Array.from(new Set(tempStates.map(a => a.state)));
      this.selectedState = ''
      this.selectedDistrict = ''
    }

    onChangeState(){
      let tempDistricts = this.existingstationdata.filter(d => d.state == this.selectedState);
      this.filteredDistricts = Array.from(new Set(tempDistricts.map(a => a.district)));
      this.selectedDistrict = ''
    }

    goBack() {
      window.history.back();
    }

    Verify(){
      if (confirm("Do want to verify these stations") == true) {
        let data = {
          date: this.dateCalculation(),
          verifiedstationdata: this.filteredStations
        }
        this.dataService.verifiedRainfallData(data).subscribe(res => {
          alert("Verified Successfully");
          this.showVerifiedDateAndMessage();
          this.filterByDate();
        })
      } else {

      }
    }

    showVerifiedDateAndMessage(){
      this.verifiedDate = String(new Date(this.selectedDate));
      this.verifiedMessage = "These stations are Verified";
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
      next: value => {
        this.existingstationdata = value;
        this.regionList = Array.from(new Set(this.existingstationdata.map(a => a.region)));
        this.filterByDate();
      },
      error: err => console.error('Error fetching data:', err)
    });
  }

  filterByDate(){
    this.verifiedDate = '';
    this.verifiedMessage = '';
    if(this.selectedDistrict){
      this.filteredStations = this.existingstationdata.filter(s =>  s.district == this.selectedDistrict);
    }
    else if(this.selectedState){
      this.filteredStations = this.existingstationdata.filter(s =>  s.state == this.selectedState);
    }
    else if(this.selectedRegion){
      this.filteredStations = this.existingstationdata.filter(s =>  s.region == this.selectedRegion);
    }
    this.filteredStations.map(x => {
      return x.RainFall = x[this.dateCalculation()];
    })
    this.filteredStations.map(x => {
      return x.isverified = x['isverified_' + this.dateCalculation()];
    })
    if(this.status){
      this.filteredStations = this.filteredStations.filter(s =>  s.isverified == this.status);
    }
    if(this.filteredStations.length > 0){
      let isverified = this.filteredStations.every(station => station && station.isverified == "verified");
      if(isverified){
        this.showVerifiedDateAndMessage();
      }
    }
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

  submit(){
    let data = {
      date: this.dateCalculation(),
      updatedstationdata: this.filteredStations
    }
    this.dataService.updateRainFallData(data).subscribe(res => {
      alert("Updated")
      this.fetchDataFromBackend();
    })
  }

}


