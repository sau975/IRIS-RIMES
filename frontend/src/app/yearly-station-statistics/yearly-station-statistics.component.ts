import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import { DataService } from '../data.service';

@Component({
  selector: 'app-yearly-station-statistics',
  templateUrl: './yearly-station-statistics.component.html',
  styleUrls: ['./yearly-station-statistics.component.css']
})
export class YearlyStationStatisticsComponent {
  selectedYear: string = '';
  selectedRegion: string = '';
  selectedState: string = '';
  selectedDistrict: string = '';
  todayDate: string;
  regionList:any[]=[];
  filteredStates:any[]=[];
  filteredDistricts:any[]=[];
  filteredStations:any[]=[];
  existingstationdata: any[] = [];
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

  constructor(
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
  }

  submit(){
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
    const imgData = '/assets/images/IMDlogo_Ipart.png';
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
