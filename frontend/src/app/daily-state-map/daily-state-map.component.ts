import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-daily-state-map',
  templateUrl: './daily-state-map.component.html',
  styleUrls: ['./daily-state-map.component.css']
})
export class DailyStateMapComponent {
  selectedDate: Date = new Date();
  inputValue: string = '';
  inputValue1: string = '';
  private initialZoom = 5;
  private map1: L.Map = {} as L.Map;
  fetchedData: any;
  currentDateNormal: string = '';
  currentDateDaily: string = '';
  currentDateNormaly: string = '';
  fetchedData1: any;
  fetchedData2: any;
  fetchedData3: any;
  fetchedData4: any;
  fetchedData5: any;
  fetchedData6: any;
  fetchedMasterData: any;
  statecountlargeexcess = 0
  statecountexcess = 0
  statecountnormal = 0
  statecountdeficient = 0
  statecountlargedeficient = 0
  statecountnorain = 0

  formatteddate: any;
  dd: any;
  today = new Date();
  inputDateDaily: string = '';
  inputDateNormal: string = '';

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router
    ) {
    let localDailyDate : any = localStorage.getItem('dailyDate')
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
    // this.loadGeoJSON1();
    this.fetchDataFromBackend();
  }

  dailyDeparture(){
    this.today = new Date(this.selectedDate);
    this.dateCalculation()
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
    const selectedYear = String(year).slice(-2);
    this.currentDateDaily = `${this.dd.padStart(2, '0')}_${currmonth}_${selectedYear}`;
    console.log(this.currentDateDaily, "dateeeeee")
  }

  fetchDataFromBackend(): void {
    this.dataService.fetchData().subscribe(
      (data) => {
        this.fetchedData = data;
        this.processFetchedData();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    // this.dataService.fetchData1().subscribe(
    //   (data) => {
    //     this.fetchedData1 = data;
    //     this.processFetchedDatastatedaily();
    //   },
    //   (error) => {
    //     console.error('Error fetching data:', error);
    //   }
    // );
    // this.dataService.fetchData2().subscribe(
    //   (data) => {
    //     this.fetchedData2 = data;
    //     this.processFetchedDatasubdivdaily();
    //   },
    //   (error) => {
    //     console.error('Error fetching data:', error);
    //   }
    // );
    // this.dataService.fetchData3().subscribe(
    //   (data) => {
    //     this.fetchedData3 = data;
    //     this.processFetchedDataregiondaily();
    //   },
    //   (error) => {
    //     console.error('Error fetching data:', error);
    //   }
    // );
    this.dataService.fetchMasterFile().subscribe({
      next: value => {
        this.fetchedMasterData = value;
        this.stationtodistrict();
        this.processFetchedDatastatedaily()
        this.loadGeoJSON();
      },
      error: err => console.error('Error fetching data:', err)
    });
  }
  findMatchingData(id: string): any | null {
    const matchedData = this.stationtodistrictdata.find((data: any) => data.districtid == id);
    console.log(matchedData)
    return matchedData || null;
  }
  findMatchingDatastate(id: string): any | null {
    const matchedData = this.statefetchedDatadaily.find((data: any) => data.statedailyid === id );
    console.log(matchedData, "gggg")
    return matchedData || null;
  }
  findMatchingDatasubdiv(id: string): any | null {
    const matchedData = this.subdivisionfetchedDatadaily.find((data: any) => data.subdivdailyid === id);
    return matchedData || null;
  }
  findMatchingDataregion(id: string): any | null {
    const matchedData = this.regionfetchedDatadaily.find((data: any) => data.regiondailyid === id);
    return matchedData || null;
  }
  processedData: any[] = [];
  statefetchedDatadaily: any[] = [];

  subdivisionfetchedDatadaily: any[] = [];

  regionfetchedDatadaily: any[] = [];
  stationtodistrictdata: any[] = [];

  processFetchedDataregiondaily(): void {
    let product = 1;
    let sum = 0;
    let previousregionID = null;
      for (const item of this.fetchedData3) {
      if ( previousregionID === item['regionid']) {
        product += item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum += item['imdarea_squarekm'];
      }
      else {
        if (previousregionID !== null) {
          this.regionfetchedDatadaily.push({
            regiondailyid: previousregionID,
            regiondailyrainfall : product/sum
          });
        }}
        product = item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum = item['imdarea_squarekm'];
      previousregionID = item['regionid'];
    }}
   processFetchedDatasubdivdaily(): void {
    let product = 1;
    let sum = 0;
    let previoussubdivId = null;
      for (const item of this.fetchedData2) {
      if ( previoussubdivId === item['subdivid']) {
        product += item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum += item['imdarea_squarekm'];
      }
      else {
        if (previoussubdivId !== null) {
          this.subdivisionfetchedDatadaily.push({
            subdivdailyid: previoussubdivId,
            subdivdailyrainfall : product/sum
          });
        }
      }
        product = item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum = item['imdarea_squarekm'];

      previoussubdivId = item['subdivid'];
    }
  }
  processFetchedDatastatedaily(): void {
    let product = 1;
    let sum = 0;
    let previousStateId = null;
      for (const item of this.fetchedMasterData) {
      if ( previousStateId === item['state_code']) {
        product += item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum += item['imdarea_squarekm'];
      }
      else {
        if (previousStateId !== null) {
          this.statefetchedDatadaily.push({
            statedailyid: previousStateId,
            statedailyrainfall : product/sum,
          });
        }}
        product = item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum = item['imdarea_squarekm'];
      previousStateId = item['state_code'];
    }
  }

  stationtodistrict() {
    this.stationtodistrictdata = [];
    let previousdistrictid = null;
    let previousdistrictname = "";
    let districtarea = null;
    let stationrainfallsum = 0;
    let numberofstations = 0;
    let previousstateid = null;
    let previousstatename = "";
    let previoussubdivid = null;
    let previoussubdivname = "";
    let subdivweights = null;
    let previousregionid = null;
    let previousregionname = "";
    let districtcumdata = 0
    for (const item of this.fetchedMasterData) {
      if (item.district_code == previousdistrictid || previousdistrictid == null) {
        if (item[this.currentDateDaily] != -999.9) {
          stationrainfallsum = stationrainfallsum + item[this.currentDateDaily];
          numberofstations = numberofstations + 1;
        }
        else {
          stationrainfallsum = stationrainfallsum + 0;
        }
      }
      else {
        this.stationtodistrictdata.push({
          districtid: previousdistrictid,
          districtname: previousdistrictname,
          districtarea: districtarea,
          subdivweights: subdivweights,
          numberofstations: numberofstations,
          stationrainfallsum: stationrainfallsum,
          dailyrainfall: stationrainfallsum / numberofstations,
          stateid: previousstateid,
          statename: previousstatename,
          subdivid: previoussubdivid,
          subdivname: previoussubdivname,
          regionid: previousregionid,
          regionname: previousregionname,
          stationrainfallsumcum: districtcumdata,
          dailyrainfallcum: districtcumdata / numberofstations,
        });
        if (item[this.currentDateDaily] != -999.9) {
          stationrainfallsum = item[this.currentDateDaily];
          numberofstations = 1;
        }
        else {
          stationrainfallsum = 0;
          numberofstations = 0;
        }
      }
      previousdistrictid = item.district_code;
      previousdistrictname = item.district_name;
      districtarea = item.district_area
      previousstateid = item.state_code;
      previousstatename = item.state_name;
      previoussubdivid = item.subdiv_code;
      previoussubdivname = item.subdiv_name;
      subdivweights = item.subdiv_weights
      previousregionid = item.region_code;
      previousregionname = item.region_name;
    }
    this.stationtodistrictdata.push({
      districtid: previousdistrictid,
      districtname: previousdistrictname,
      districtarea: districtarea,
      subdivweights: subdivweights,
      numberofstations: numberofstations,
      stationrainfallsum: stationrainfallsum,
      dailyrainfall: stationrainfallsum / numberofstations,
      stateid: previousstateid,
      statename: previousstatename,
      subdivid: previoussubdivid,
      subdivname: previoussubdivname,
      regionid: previousregionid,
      regionname: previousregionname,
      stationrainfallsumcum: districtcumdata,
      dailyrainfallcum: districtcumdata / numberofstations,
    });
  }

  processFetchedData(): void {
    if (this.inputValue && this.inputValue1) {
      this.processedData = [];
      for (const item of this.fetchedData) {
        this.processedData.push({ districtdailyID: item.districtid, districtdailyRainfall: item[this.inputDateDaily]});
      }}
      else {
        this.processedData = [];
      for (const item of this.fetchedData) {
        this.processedData.push({ districtdailyID: item.districtid, districtdailyRainfall: item[this.currentDateDaily]});
      }}}

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
      content: '<i class="bi bi-arrows-fullscreen"></i>'
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
            const rainfall = matchedData ? matchedData.statedailyrainfall: 0;
            const color = this.getColorForRainfallstate(rainfall);
            return {
              fillColor: color,
              weight: 0.5,
              opacity: 2,
              color: 'black',
              fillOpacity: 2
            };
          },
          onEachFeature: (feature: any, layer: any) => {
            let id1 = feature.properties['state_name'];
            const id2 = feature.properties['state_code'];
            const matchedData = this.findMatchingDatastate(id2);
            const rainfall = matchedData ? matchedData.statedailyrainfall.toFixed(2) : '0.00';
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

  getColorForRainfallstate(rainfall: any, actual?: string): string {
    const numericId = rainfall;
    let cat = '';
    if (actual == ' ') {
      return '#c0c0c0';
    }
    if (numericId >= 60) {
      this.statecountlargeexcess = this.statecountlargeexcess +1
      cat = 'LE';
      return '#0096ff';
    }
    if (numericId >= 20 && numericId <= 59) {
      this.statecountexcess = this.statecountexcess +1
      cat = 'E';
      return '#32c0f8';
    }
    if (numericId >= -19 && numericId <= 19) {
      this.statecountnormal = this.statecountnormal +1
      cat = 'N';
      return '#00cd5b';
    }
    if (numericId >= -59 && numericId <= -20) {
      this.statecountdeficient = this.statecountdeficient + 1
      cat = 'D';
      return '#ff2700';
    }
    if (numericId >= -99 && numericId <= -60) {
      this.statecountlargedeficient  = this.statecountlargedeficient + 1
      cat = 'LD';
      return '#ffff20';
    }
    if (numericId == -100) {
      this.statecountnorain = this.statecountnorain + 1
      cat = 'NR';
      return '#ffffff';
    }
    if (numericId == ' ') {
      return '#c0c0c0';
    }

    else {
      cat = 'ND';
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

