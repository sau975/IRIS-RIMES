import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-realtime-station-data',
  templateUrl: './realtime-station-data.component.html',
  styleUrls: ['./realtime-station-data.component.css'],
})
export class RealtimeStationDataComponent {
  selectedRegions: string[] = [];
  selectedStates: string[] = [];
  tempfilteredStations: any[] = [];
  regionList: any[] = [];
  filteredStates: any[] = [];
  filteredDistricts: any[] = [];
  filteredStations: any[] = [];
  rainFallInMM: number = 0;
  existingstationdata: any[] = [];
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

  onChangeRegion(checkedValues:any){
    this.clearDropdown = true;
    this.selectedRegions = checkedValues;
    let tempStates = this.existingstationdata.filter(item => {
      return checkedValues.some((value:any) => {
        return item.region == value;
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
        this.filterByDate();
      },
      error: (err) => console.error('Error fetching data:', err),
    });
  }

  filterByDate() {
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
    else if(this.selectedRegions && this.selectedRegions.length > 0){
      this.filteredStations = this.existingstationdata.filter(item => {
        return this.selectedRegions.some((value:any) => {
          return item.region == value;
        });
      })
    }
  }
}
