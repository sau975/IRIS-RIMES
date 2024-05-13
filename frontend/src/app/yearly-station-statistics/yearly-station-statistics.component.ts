import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-yearly-station-statistics',
  templateUrl: './yearly-station-statistics.component.html',
  styleUrls: ['./yearly-station-statistics.component.css']
})
export class YearlyStationStatisticsComponent {
  selectedYear: string = '';
  selectedRegions: string[] = [];
  selectedStates: string[] = [];
  tempfilteredStations: any[] = [];
  selectedMcs: string[] = [];
  regionList: any[] = [];
  filteredMcs: any[] = [];
  filteredStates: any[] = [];
  todayDate: string;
  filteredDistricts:any[]=[];
  filteredStations:any[]=[];
  existingstationdata: any[] = [];
  mcdata = [
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"}
  ]
  // yearlyStationData: any[] = [
  //   {
  //     sNo: 1,
  //     region: "North India",
  //     state: "Bihar",
  //     district: "Nalanda",
  //     station: "Biharsharif",
  //     date: "13-03-2024",
  //     rainfall: 4.5
  //   }
  // ];
  date: string = String(new Date().getDate());
  month: string = String((new Date().getMonth() + 1).toString().length == 1 ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1));
  year: string = '2024'

  fromDate: Date = new Date();
  toDate: Date = new Date();
  // allDaysInMonth:any[]=[];





  setFromAndToDate() {
    let data = {
      fromDate: this.fromDate,
      toDate: this.toDate
    }
    this.dataService.setfromAndToDate(JSON.stringify(data));
  }

  validateDateRange() {
    var fromDate = this.fromDate;
    var toDate = this.toDate

    if (fromDate > toDate) {
      alert('From date cannot be greater than To date');
      this.fromDate = toDate;
    }
  }

  constructor(
    private router: Router,
    private dataService: DataService,
  ) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    this.todayDate = yyyy + '-' + mm + '-' + dd;
  }

  ngOnInit(): void {
    this.fetchDataFromBackend();
  }

  goBack() {
    window.history.back();
  }

  dateCalculation() {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    let newDate = new Date(this.selectedYear);
    let dd = String(newDate.getDate());
    const year = newDate.getFullYear();
    const currmonth = months[newDate.getMonth()];
    const selectedYear = String(year).slice(-2);
    return `${dd.padStart(2, '0')}_${currmonth}_${selectedYear}`;
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

  fetchDataFromBackend(): void {
    this.dataService.existingstationdata().subscribe({
      next: value => {
        this.existingstationdata = value;
        let regionList = Array.from(new Set(this.existingstationdata.map(a => a.region)));
        this.regionList = regionList.map(x => {
          return {name: x}
        })
        this.filterByDate();
      },
      error: err => console.error('Error fetching data:', err)
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
      return x.rainFall = x[this.dateCalculation()];
    })
  }

  submit(){
    this.setFromAndToDate()
    this.filterByDate();
  }

  download(): void {
    const doc = new jsPDF() as any;
    // const columns1 = [' ', ' ', { content: 'Year : 2024' },'','','','']
    const columns = ['S.No', 'Region', 'State', 'District', 'Station', 'Date', 'Rainfall'];
    const cellHeight = 8;
    const marginLeft = 10;
    const marginTop = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = 15;
    const imgMargin = 10;
    const imgX = pageWidth - imgWidth - imgMargin;
    const imgData150 = '/assets/images/IMD150(BGR).png';
    doc.addImage(imgData150, 'PNG', imgX, marginTop, 15, 20);
    const imgData = '/assets/images/IMDlogo_Ipart-iris.png';
    doc.addImage(imgData, 'PNG', marginLeft, marginTop, 15, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Set font color to black
    const headingText = 'India Meteorological Department\nHydromet Division, New Delhi';
    const headingText1 = 'YEARLY STATION STATISTICS 2024';
    doc.text(headingText, marginLeft + 25, marginTop + 8); // Adjust position as needed
    doc.text(headingText1, marginLeft + 50, marginTop + 28);

    doc.autoTable({
      head: [columns],
      body: this.filteredStations,
      theme: 'striped',
      startY: marginTop + cellHeight + 25,
      margin: { left: marginLeft },
      styles: { fontSize: 7 },
      didDrawCell: function (data: { cell: { text: any; x: number; y: number; width: any; height: any; }; }) {
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        doc.setDrawColor(0);
      },
      didParseCell: function (data: any) {
        data.cell.styles.fontStyle = 'bold';
      }
    });

    const filename = 'Yearly_Station_Statistics.pdf';
    doc.save(filename);
  }
}
