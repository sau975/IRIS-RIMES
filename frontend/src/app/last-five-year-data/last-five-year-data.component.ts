import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-last-five-year-data',
  templateUrl: './last-five-year-data.component.html',
  styleUrls: ['./last-five-year-data.component.css']
})
export class LastFiveYearDataComponent {
  selectedRegions: string[] = [];
  selectedStates: string[] = [];
  tempfilteredStations: any[] = [];
  regionList: any[] = [];
  filteredStates: any[] = [];
  filteredDistricts: any[] = [];
  filteredStations: any[] = [];
  rainFallInMM: number = 0;
  existingstationdata: any[] = [];
  selectedMcs: string[] = [];
  filteredMcs: any[] = [];

  mcdata = [
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"}
  ]
  clearDropdown: boolean = false;

  ngOnInit(): void {
    this.fetchDataFromBackend();
  }
  constructor(private dataService: DataService) {}

  goBack() {
    window.history.back();
  }

  fetchDataFromBackend(): void {
    this.dataService.existingstationdata().subscribe({
      next: (value) => {
        this.existingstationdata = value;
        let regionList = Array.from(new Set(this.existingstationdata.map(a => a.region)));
        this.regionList = regionList.map(x => {
          return {name: x}
        })
      },
      error: (err) => console.error('Error fetching data:', err),
    });
  }

  onChangeRegion(checkedValues:any){
    this.selectedRegions = checkedValues;
    let tempMcs = this.existingstationdata.filter(item => {
      return checkedValues.some((value:any) => {
        return item.region == value;
      });
    });
    let tempfilteredMcs = Array.from(new Set(tempMcs.map(a => a.rmc_mc)));
    this.filteredMcs = tempfilteredMcs.map(a => { return {name: a}});
  }

  onChangeMc(checkedValues:any){
    this.selectedMcs = checkedValues;
    let tempStates = this.existingstationdata.filter(item => {
      return checkedValues.some((value:any) => {
        return item.rmc_mc == value;
      });
    });
    let tempfilteredStates = Array.from(new Set(tempStates.map(a => a.state)));
    this.filteredStates = tempfilteredStates.map(a => { return {name: a}});
  }

  onChangeState(checkedValues:any){
    this.selectedStates = checkedValues;
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
    this.tempfilteredStations = Array.from(new Set(tempStations.map(a => a.station)));
  }

  shareCheckedList(item:any[]){
    console.log(item);
  }
  shareIndividualCheckedList(item:any){
    console.log(item);
  }

  submit(){

  }
}
