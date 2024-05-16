import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-verification-page',
  templateUrl: './verification-page-mc.component.html',
  styleUrls: ['./verification-page-mc.component.css']
})
export class VerificationPageMcComponent {
  selectedRegions: string[] = [];
  selectedStates: string[] = [];
  selectedMcs: string[] = [];
  selectedRMcs: string[] = [];
  selectedDistricts: string[] = [];
  tempfilteredStations: any[] = [];
  regionList: any[] = [];
  filteredMcs: any[] = [];
  filteredRMcs: any[] = [];
  filteredStates: any[] = [];
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
  verifiedMessage: string = '';
  status: string = '';
  mcdata = [
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"}
  ]

  ngOnInit(): void {
    this.fetchDataFromBackend();
    const loginedMC = localStorage.getItem('isAuthorised');
    const MCData = JSON.parse(loginedMC ?? '{}');
    const loginedMCName = MCData.data[0].name;
    // console.log('Mc data', MCData)
    //  console.log('loginMCName', loginedMCName)
    // console.log('loginedMCData', loginedMCData)

        if(loginedMCName.split(" ")[0] == "MC"){
          this.filteredMcs.push({name: loginedMCName})
        } else {
          this.filteredRMcs.push({name: loginedMCName})
        }
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

  onChangeRegion() {

      let tempfilteredMcs = Array.from(new Set(this.existingstationdata.map(a => a.rmc_mc)));

      tempfilteredMcs.forEach(m => {
        if(m.split(" ")[0] == "MC"){
          this.filteredMcs.push({name: m})
        }
      });

      tempfilteredMcs.forEach(m => {
        if(m.split(" ")[0] == "RMC"){
          this.filteredRMcs.push({name: m})
        }
      });
    }

  onChangeMc() {
    console.log(this.existingstationdata)
      console.log(this.selectedMcs);

    let tempStates = this.existingstationdata.filter(item => {
        return this.selectedMcs.some((value:any) => {
          return item.rmc_mc.toLowerCase() == value.name.toLowerCase();
        });
      });
      console.log(tempStates);
    let tempfilteredStates = Array.from(new Set(tempStates.map(a => a.state)));
    this.filteredStates = tempfilteredStates.map(a => { return { name: a } });
    
    }

    onChangeRMc(){
      let tempStates = this.existingstationdata.filter(item => {
        return this.selectedRMcs.some((value:any) => {
          return item.rmc_mc.toLowerCase() == value.name.toLowerCase();
        });
      });
      console.log('RMC change', tempStates)
      let tempfilteredStates = Array.from(new Set(tempStates.map(a => a.state)));
      this.filteredStates = tempfilteredStates.map(a => { return {name: a}});
    }

    onChangeState(){
      let tempDistricts = this.existingstationdata.filter(item => {
        return this.selectedStates.some((value:any) => {
          return item.state == value.name;
        });
      })
      let tempfilteredDistricts = Array.from(new Set(tempDistricts.map(a => a.district)));
      this.filteredDistricts = tempfilteredDistricts.map(a => { return {name: a}});
    }

    onChangeDistrict(){
      let tempStations = this.existingstationdata.filter(item => {
        return this.selectedDistricts.some((value:any) => {
          return item.district == value.name;
        });
      })
      this.tempfilteredStations = Array.from(new Set(tempStations.map(a => a.station)));
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

    Verify(){
      if (confirm("Do want to verify these stations") == true) {
        let data = {
          date: this.dateCalculation(),
          verifiedDateTime: new Date(),
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
        let regionList = Array.from(new Set(this.existingstationdata.map(a => a.region)));
        this.regionList = regionList.map(x => {
          return {name: x}
        })
        this.filteredStations = value.filter((x:any) => x[this.dateCalculation()] >= 0);
        this.filterByDate();
        // this.onChangeRegion();

      },
      error: err => console.error('Error fetching data:', err)
    });
  }

  filterByDate(){
    this.verifiedMessage = '';
    if(this.tempfilteredStations && this.tempfilteredStations.length > 0){
      this.filteredStations = this.existingstationdata.filter(item => {
        return this.tempfilteredStations.some((value:any) => {
          return item.station == value;
        });
      })
    }
    else if(this.selectedStates && this.selectedStates.length > 0){
      this.filteredStations = this.existingstationdata.filter(item => {
        return this.selectedStates.some((value:any) => {
          return item.state == value;
        });
      })
    }
    else if(this.selectedMcs && this.selectedMcs.length > 0){
      this.filteredStations = this.existingstationdata.filter(item => {
        return this.selectedMcs.some((value:any) => {
          return item.rmc_mc == value;
        });
      })
    }
    else if(this.selectedRegions && this.selectedRegions.length > 0){
      this.filteredStations = this.existingstationdata.filter(item => {
        return this.selectedRegions.some((value:any) => {
          return item.region == value;
        });
      })
    }
    this.filteredStations.map(x => {
      return x.RainFall = x[this.dateCalculation()];
    })
    this.filteredStations = this.filteredStations.filter((x:any) => x[this.dateCalculation()] >= 0);
    this.filteredStations.map(x => {
      return x.isverified = x['isverified_' + this.dateCalculation()];
    })
    if(this.status){
      this.filteredStations = this.filteredStations.filter(s =>  s.isverified != 'null');
    }
    if(this.filteredStations.length > 0){
      let isverified = this.filteredStations.every(station => station && station.isverified != 'null');
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

  sendEmail(){
    if (confirm("Do want to send email") == true) {
      // let emails = ["saurav97531@gmail.com", "pavan@rimes.int", "dominic@rimes.int", "tarakesh@rimes.int", "saipraveen@rimes.int", "saurabh@rimes.int"];
      let emails = ["saurav97531@gmail.com"];
      emails.forEach(email => {
        let data = {
          to: email,
          subject: `Rainfall data is not correct for - ${new Date().toDateString()}`,
          text: `Hi Rainfall data is not correct for - ${new Date().toDateString()} please correct it`,
        }
        this.dataService.sendEmail(data).subscribe(res => {
          console.log("Email Sent Successfully");
        })
      })
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


