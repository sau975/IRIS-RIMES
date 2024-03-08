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
        localStorage.setItem('verifiedDate', JSON.stringify(new Date()));
        localStorage.setItem('verifiedMessage', "These stations are Verified");
        this.showVerifiedDateAndMessage();
      } else {

      }
    }

    showVerifiedDateAndMessage(){
      let verifiedDate:any = localStorage.getItem('verifiedDate');
      this.verifiedDate = JSON.parse(verifiedDate);
      let verifiedMessage:any = localStorage.getItem('verifiedMessage');
      this.verifiedMessage = verifiedMessage;
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
    // this.showVerifiedDateAndMessage();
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


