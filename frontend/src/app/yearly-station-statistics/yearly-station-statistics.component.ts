import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';

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
  regionList:any[]=[];
  filteredStates:any[]=[];
  filteredDistricts:any[]=[];
  filteredStations:any[]=[];
  existingstationdata: any[] = [];
  yearlyStationData: any[] = [
    {
      sNo: 1,
      region: "North India",
      state: "Bihar",
      district: "Nalanda",
      station: "Biharsharif",
      date: "13-03-2024",
      rainfall: 4.5
    }
  ];

  goBack() {
    window.history.back();
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

  submit(){

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
      body: this.yearlyStationData,
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
