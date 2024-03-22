import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-normal-state-map',
  templateUrl: './normal-state-map.component.html',
  styleUrls: ['./normal-state-map.component.css']
})
export class NormalStateMapComponent {
  inputValue: string = '';
  inputValue1: string = '';
  private initialZoom = 5;
  private map1: L.Map = {} as L.Map;
  // public placeholderText: string;
  fetchedData: any;
  // inputDateNormal: string;
  // inputDateDaily: string;
  fetchedData4: any;
  fetchedData5: any;
  fetchedData6: any;
  formatteddate: any;
  dd: any;
  today = new Date();
  currentDateNormal: string = '';
  currentDateDaily: string = '';
  currentDateNormaly: string = '';
  statecountlargeexcess = 0
  statecountexcess = 0
  statecountnormal = 0
  statecountdeficient = 0
  statecountlargedeficient = 0
  statecountnorain = 0
  fromDate: Date = new Date();
  toDate: Date = new Date();
  weeklyDates:any[]=[];

  constructor(private http: HttpClient,
    private dataService: DataService,
    private router: Router
    ) {
    let localDailyDate:any = localStorage.getItem('dailyDate')
    if(localDailyDate){
      let dailyDate = JSON.parse(localDailyDate);
      this.today.setDate(dailyDate.date)
      this.today.setMonth(dailyDate.month - 1)
      this.today.setFullYear(dailyDate.year)
    }
    this.dateCalculation();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      location.reload();
    });
    this.fetchDataFromBackend();
  }

  validateDateRange() {
    var fromDate = this.fromDate;
    var toDate = this.toDate

    if (fromDate > toDate) {
        alert('From date cannot be greater than To date');
        this.fromDate = toDate;
    }
  }

  weeklyDatesCalculation(){
    this.weeklyDates = [];
    if(this.fromDate && this.toDate){
      var startDate = new Date(this.fromDate);
      var endDate = new Date(this.toDate);
      var currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        var dd = String(currentDate.getDate());
        const currmonth = this.months[currentDate.getMonth()];
        this.weeklyDates.push(`${currmonth}${dd}`);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    this.fetchDataFromBackend();
  }

  dateCalculation(){
    const yesterday = new Date(this.today);
    yesterday.setDate(this.today.getDate() - 1);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    this.dd = String(this.today.getDate());

    const mon = String(this.today.getMonth() + 1)
    const year = this.today.getFullYear();
    this.formatteddate = `${this.dd.padStart(2, '0')}-${mon.padStart(2, '0')}-${year}`
    const currmonth = months[this.today.getMonth()];
    const enddate = `${currmonth}${this.dd}`
    const ddy = String(yesterday.getDate());
    const currmonthy = months[yesterday.getMonth()];

    this.currentDateNormal = `${currmonth}${this.dd}`;
    this.currentDateNormaly = `${currmonthy}${ddy}`;
    this.currentDateDaily = `${this.dd.padStart(2, '0')}-${currmonth}`;
    console.log(this.currentDateDaily)
  }

  fetchDataFromBackend(): void {
    this.dataService.fetchData().subscribe(
      (data) => {
        this.fetchedData = data;
        this.processFetchedData();
        this.loadGeoJSON();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    this.dataService.fetchData4().subscribe(
      (data) => {
        this.fetchedData4 = data;
        this.processFetchedDatastatenormal();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    this.dataService.fetchData5().subscribe(
      (data) => {
        this.fetchedData5 = data;
        this.processFetchedDatasubdivnormal();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    this.dataService.fetchData6().subscribe(
      (data) => {
        this.fetchedData6 = data;
        this.processFetchedDataregionnormal();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  findMatchingData(id: string): any | null {
    const matchedData = this.processedData.find((data: any) => data.districtID === id);
    return matchedData || null;
  }
  findMatchingDatastate(id: string): any | null {
    const matchedData = this.statefetchedDatanormal.find((data: any) => data.statenormalid === id );
    return matchedData || null;
  }
  findMatchingDatasubdiv(id: string): any | null {
    const matchedData = this.subdivisionfetchedDatanormal.find((data: any) => data.subdivnormalid === Number(id));
    return matchedData || null;
  }
  findMatchingDataregion(id: string): any | null {
    const matchedData = this.regionfetchedDatanormal.find((data: any) => data.regionnormalid === id);
    return matchedData || null;
  }
  processedData: any[] = [];
  statefetchedDatanormal: any[] = [];
  subdivisionfetchedDatanormal: any[] = [];
  regionfetchedDatanormal: any[] = [];

  processFetchedDataregionnormal(): void {
    this.regionfetchedDatanormal = [];
    for (const item of this.fetchedData6) {
      let normal: number
      if(this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' ||this.currentDateNormal === 'Jun1' ||this.currentDateNormal === 'Oct1'){
        normal = item[this.currentDateNormal]
      }
      else{
        normal = (item[this.currentDateNormal] - item[this.currentDateNormaly])
      }
      this.regionfetchedDatanormal.push({
        regionnormalid: item['regionid'],
        regionnormalrainfall: normal
      });

    }
  }
  processFetchedDatasubdivnormal(): void {
    this.subdivisionfetchedDatanormal = [];
    for (const item of this.fetchedData5) {
      let normal: number
      if(this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' ||this.currentDateNormal === 'Jun1' ||this.currentDateNormal === 'Oct1'){
        normal = item[this.currentDateNormal]
      }
      else{
        normal = (item[this.currentDateNormal] - item[this.currentDateNormaly])
      }
      this.subdivisionfetchedDatanormal.push({
        subdivnormalid: item['subdivid'],
        subdivnormalrainfall:normal
      });
      }}
  processFetchedDatastatenormal(): void {
    this.statefetchedDatanormal = [];
    for (const item of this.fetchedData4) {
      let normal: number
      if(this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' ||this.currentDateNormal === 'Jun1' ||this.currentDateNormal === 'Oct1'){
        normal = item[this.currentDateNormal]
      }
      else{
        normal = (item[this.currentDateNormal] - item[this.currentDateNormaly])
      }
      this.statefetchedDatanormal.push({
        statenormalid: item['state_code'],
        statenormalrainfall: normal
      });
    }
  }
  processFetchedData(): void {

      this.processedData = [];
      for (const item of this.fetchedData) {
        let normal: number
        if(this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' ||this.currentDateNormal === 'Jun1' ||this.currentDateNormal === 'Oct1'){
          normal = item[this.currentDateNormal]
        }
        else{
          normal = (item[this.currentDateNormal] - item[this.currentDateNormaly])
        }
        let den = item[this.currentDateDaily];
        if (item[this.currentDateDaily] == 0) {
          den = 1;
        }
        this.processedData.push({ districtID: item.district_code, Rainfall: normal });
      }
    }
      private updateLegendDetailsPositionstate(fullscreen: boolean): void {
    const legendDetailsElement = document.querySelector('.legenddetails') as HTMLElement; // Use type assertion to HTMLElement
    //const datacontElement = document.querySelector('.datacont') as HTMLElement;
    if (legendDetailsElement) {
      if (fullscreen) {
        legendDetailsElement.style.right = '50px';
      } else {
        legendDetailsElement.style.right = '200px';
      }
    }
  }

  private initMap(): void {
    this.map1 = L.map('map1', {
      center: [23, 76.9629],
      zoom: this.initialZoom,
      scrollWheelZoom: false
    });
    this.map1.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map1.setZoom(this.initialZoom);
        this.updateLegendDetailsPositionstate(true)
      } else {
        this.map1.setZoom(this.initialZoom);
        this.updateLegendDetailsPositionstate(false)
      }
    });
    const fullscreenControl = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },

      content: '<i class="fas fa-expand"></i>'
    });
    this.map1.addControl(fullscreenControl);
  }
  private isFullscreen(): boolean {
    return !!(document.fullscreenElement || document.fullscreenElement ||
      document.fullscreenElement || document.fullscreenElement);
  }
  public months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];


  public month = this.months[this.today.getMonth()];
  public day = String(this.today.getDate()).padStart(2, '0');


  private clearTextElements(): void {
    for (const textElement of this.addedTextElements) {
      textElement.remove();
    }
    this.addedTextElements = [];
  }
  private addedTextElements: HTMLElement[] = [];
 loadGeoJSON(): void {
  this.clearTextElements();
    this.http.get('assets/geojson/INDIA_STATE.json').subscribe((res: any) => {
      this.statecountlargeexcess = 0
      this.statecountexcess = 0
      this.statecountnormal = 0
      this.statecountdeficient = 0
      this.statecountlargedeficient = 0
      this.statecountnorain = 0
        const geoJsonLayer = L.geoJSON(res, {
          style: (feature: any) => {
          const id2 = feature.properties['state_code'];
          const matchedData = this.findMatchingDatastate(id2);
          const rainfall = matchedData ? matchedData.statenormalrainfall: 0;
          const color = this.getColorForRainfall(rainfall);
          return {
            fillColor: color,
            weight: 0.5,
            opacity: 2,
            color: 'black',
            fillOpacity: 0.7
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          let id1 = feature.properties['state_name'];
          const id2 = feature.properties['state_code'];
          const matchedData = this.findMatchingDatastate(id2);
          const rainfall = matchedData ? matchedData.statenormalrainfall.toFixed(2) : '0.00';
          const textElement = document.createElement('div');
          const bounds = layer.getBounds();
          const center = bounds.getCenter();
          const lat = center.lat
          const lng = center.lng
          if (id1 == "ARUNACHAL PRADESH") {
            id1 = "AR"
            center.lat = 29
            center.lng = 94.2
          }
          if (id1 == "LADAKH (UT)") {
            id1 = "LA"
            center.lat = 35.3
            center.lng = 76
          }
          if (id1 == "JAMMU & KASHMIR (UT)") {
            id1 = "JK"
            center.lat = 34.5
            center.lng = 73.2
          }
          if (id1 == "HIMACHAL PRADESH") {
            id1 = "HP"
            center.lat = 32.7
            center.lng = 76
          }
          if (id1 == "PUNJAB") {
            id1 = "PB"
            center.lat = 31.5
            center.lng = 73.8
          }
          if (id1 == "CHANDIGARH (UT)") {
            id1 = "CH"
            center.lat = 30.8
            center.lng = 76
          }
          if (id1 == "UTTARAKHAND") {
            id1 = "UK"
            center.lat = 30.2
            center.lng = 78.5
          }
          if (id1 == "HARYANA") {
            id1 = "HR"
            center.lat = 29.5
            center.lng = 75
          }
          if (id1 == "DELHI (UT)") {
            id1 = "DL"
            center.lng = 77.1
          }
          if (id1 == "UTTAR PRADESH") {
            id1 = "UP"
            center.lat = 27.2
            center.lng = 79.2
          }
          if (id1 == "RAJASTHAN") {
            id1 = "RJ"
            center.lat = 27
            center.lng = 72
          }
          if (id1 == "GUJARAT") {
            id1 = "GJ"
            center.lat = 23.5
            center.lng = 71
          }
          if (id1 == "MADHYA PRADESH") {
            id1 = "MP"
            center.lat = 23.9
            center.lng = 76.5
          }
          if (id1 == "DADRA & NAGAR HAVELI AND DAMAN & DIU (UT)") {
            id1 = "DH & DD"
            center.lat = 21.5
            center.lng = 72
          }
          if (id1 == "MAHARASHTRA") {
            id1 = "MH"
            center.lat = 19.5
            center.lng = 74
          }
          if (id1 == "TELANGANA") {
            id1 = "TS"
            center.lat = 18
            center.lng = 77.7
          }
          if (id1 == "GOA") {
            id1 = "GA"
            center.lat = 15.6
            center.lng = 73
          }
          if (id1 == "KARNATAKA") {
            id1 = "KA"
            center.lat = 15
            center.lng = 74.7
          }
          if (id1 == "ANDHRA PRADESH") {
            id1 = "AP"
            center.lat = 15.5
            center.lng = 78
          }
          if (id1 == "TAMILNADU") {
            id1 = "TN"
            center.lat = 11.5
            center.lng = 77.5
          }
          if (id1 == "LAKSHADWEEP (UT)") {
            id1 = "LD"
            center.lat = 10.8
            center.lng = 71.5
          }
          if (id1 == "KERALA") {
            id1 = "KL"
            center.lat = 10.5
            center.lng = 75.5
          }
          if (id1 == "PUDUCHERRY (UT)") {
            id1 = "PY"
            center.lat = 11.5
            center.lng = 79.5
          }
          if (id1 == "CHHATTISGARH") {
            id1 = "CG"
            center.lat = 22
            center.lng = 81
          }
          if (id1 == "ODISHA") {
            id1 = "OD"
            center.lat = 20.8
            center.lng = 83.3
          }
          if (id1 == "JHARKHAND") {
            id1 = "JH"
            center.lng = 84
          }
          if (id1 == "WEST BENGAL") {
            id1 = "WB"
            center.lat = 23.7
            center.lng = 86.8
          }
          if (id1 == "BIHAR") {
            id1 = "BR"
            center.lat = 26
            center.lng = 85.3
          }
          if (id1 == "SIKKIM") {
            id1 = "SK"
            center.lat = 28.5
            center.lng = 88
          }

          if (id1 == "ASSAM") {
            id1 = "AS"
            center.lat = 26.8
            center.lng = 91.9
          }
          if (id1 == "MEGHALAYA") {
            id1 = "ML"
            center.lat = 25.7
            center.lng = 90.5
          }
          if (id1 == "TRIPURA") {
            id1 = "TR"
            center.lat = 23.5
            center.lng = 90.5
          }
          if (id1 == "NAGALAND") {
            id1 = "NL"

          }
          if (id1 == "MIZORAM") {
            id1 = "MZ"

          }
          if (id1 == "MANIPUR") {
            id1 = "MN"

          }
          if (id1 == "ANDAMAN & NICOBAR ISLANDS (UT)") {
            id1 = "AN"
            center.lat = 9.8
            center.lng = 91.7
          }

          // console.log(id1)
          textElement.innerHTML = `
          <div style="text-align: center; line-height: 0.4;">
          <div style="color: #000000; font-weight: bold;text-wrap: nowrap; font-size: 9px; margin-bottom: 3px;">${id1}</div>
          <div style="color: #000000; font-weight: bold;text-wrap: nowrap; font-size: 9px; margin-bottom: 3px;">${Math.round(rainfall)}</div>
          </div>`;


          // Set the position of the custom HTML element on the map
          textElement.classList.add('custom-text-element');
          textElement.style.position = 'absolute';
          textElement.style.left = `${this.map1.latLngToLayerPoint(center).x}px`;
          textElement.style.top = `${this.map1.latLngToLayerPoint(center).y}px`;


          // Set a higher z-index to ensure the text appears on top of the map
          textElement.style.zIndex = '1000';


          // Append the custom HTML element to the map container
          this.map1.getPanes().overlayPane.appendChild(textElement);
          this.addedTextElements.push(textElement);
        }
      });
      // Add the geoJsonLayer to the map
      geoJsonLayer.addTo(this.map1);
    });
  }
  getColorForRainfall(rainfall: number): string {
    const numericId = rainfall;
    if (numericId == 0 ) {
      return '#808080';
    }
    if (numericId >= 0.1 && numericId <= 2.4) {
      return '#90ee90';
    }
    if (numericId >= 2.5 && numericId <= 7.5) {
      return '#008000';
    }
    if (numericId >= 7.6 && numericId <= 20.4) {
      return '#add8e6';
    }
    if (numericId >= 20.5 && numericId <= 35.5) {
      return '#0000ff';
    }
    if (numericId >= 35.6 && numericId <= 64.4) {
      return '#ffff00';
    }
    if (numericId >= 64.5 && numericId <= 124.4) {
      return '#ffd700';
    }
    if (numericId >= 124.5 && numericId <= 150.4) {
      return '#ff8c00';
    }
    if (numericId >= 150.5 && numericId <= 204.4) {
      return '#ff0000';
    }
    if (numericId > 204.4) {
      return '#800000';
    }
    else {
      return '#c0c0c0';
    }
  }

  filter = (node: HTMLElement) => {
    const exclusionClasses = ['download', 'downloadpdf', 'leaflet-control-zoom', 'leaflet-control-fullscreen', 'leaflet-control-zoomin'];
    return !exclusionClasses.some((classname) => node.classList?.contains(classname));
  }

  downloadMapImage1(): void {
    htmlToImage.toJpeg(document.getElementById('map1') as HTMLElement, { quality: 0.95, filter: this.filter })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'state_dep.jpeg';
        link.href = dataUrl;
        link.click();
      });
  }
}
