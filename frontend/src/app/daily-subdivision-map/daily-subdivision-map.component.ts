import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-daily-subdivision-map',
  templateUrl: './daily-subdivision-map.component.html',
  styleUrls: ['./daily-subdivision-map.component.css']
})
export class DailySubdivisionMapComponent {
  selectedDate: Date = new Date();
  inputValue: string = '';
  inputValue1: string = '';
  private initialZoom = 5;
  private map2: L.Map = {} as L.Map;
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
  subdivcountlargeexcess = 0
  subdivcountexcess = 0
  subdivcountnormal = 0
  subdivcountdeficient = 0
  subdivcountlargedeficient = 0
  subdivcountnorain = 0
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
      if ( previousregionID=== item['regionid']) {
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

      private updateLegendDetailsPositionsubdiv(fullscreen: boolean): void {
        const legendDetailsElement = document.querySelector('.legenddetailssubdiv1') as HTMLElement; // Use type assertion to HTMLElement
        if (legendDetailsElement) {
          if (fullscreen) {
            legendDetailsElement.style.right = '50px';
          } else {
            legendDetailsElement.style.right = '200px';
          }
        }
      }


  private initMap(): void {
    this.map2 = L.map('map2', {
      center: [23, 76.9629],
      zoom: this.initialZoom,
      scrollWheelZoom: false
    });
    this.map2.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map2.setZoom(this.initialZoom);
        this.updateLegendDetailsPositionsubdiv(true)
        this.loadGeoJSON()
      } else {
        this.map2.setZoom(this.initialZoom);
        this.updateLegendDetailsPositionsubdiv(false)
        this.loadGeoJSON()
      }
    });
    const fullscreenControl = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },
      content: '<i class="bi bi-arrows-fullscreen"></i>'
    });
    this.map2.addControl(fullscreenControl);
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
  private loadGeoJSON(): void {
    this.clearTextElements();
    this.http.get('assets/geojson/INDIA_SUB_DIVISION.json').subscribe((res: any) => {
      this.subdivcountlargeexcess = 0
      this.subdivcountexcess = 0
      this.subdivcountnormal = 0
      this.subdivcountdeficient = 0
      this.subdivcountlargedeficient = 0
      this.subdivcountnorain = 0
      const geoJsonLayer = L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['SubDiv_Cod'];
          const matchedData = this.findMatchingDatasubdiv(id2);
          const rainfall = matchedData ? matchedData.subdivdailyrainfall : 0;
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
          let id1 = feature.properties['subdivisio'];
          const id2 = feature.properties['SubDiv_Cod'];
          const matchedData = this.findMatchingDatasubdiv(id2);
          const rainfall = matchedData ? matchedData.subdivdailyrainfall.toFixed(2) : '0.00';;
          const textElement = document.createElement('div');
          const bounds = layer.getBounds();
          const center = bounds.getCenter();
          const lat = center.lat
          const lng = center.lng

          if (id1 == "ARUNACHAL PRADESH") {
            id1 = "AR"
            center.lat = 28
            center.lng = 96.5
          }
          if (id1 == "ASSAM & MEGHALAYA") {
            id1 = "AS & ML"
            center.lat = 25.5
            // center.lng = 91.9
          }
          if (id1 == "NMMT") {
            id1 = "NL & MN & MZ & TR"
            center.lat = 23.5
            center.lng = 94

          }
          if (id1 == "SHWB & SIKKIM") {
            id1 = "SHWB & SK"
            center.lat = 27.5
            center.lng = 89.5
          }

          if (id1 == "GANGETIC WEST BENGAL") {
            id1 = "G-WB"
            center.lat = 22.5
            center.lng = 89
          }
          if (id1 == "JHARKHAND") {
            id1 = "JH"
            center.lat = 23
            center.lng = 86
          }
          if (id1 == "BIHAR") {
            id1 = "BR"
             center.lat = 25.5
            center.lng = 87
          }
          if (id1 == "EAST UTTAR PRADESH") {
            id1 = "E-UP"
            // center.lat = 27.2
            center.lng = 82.8
          }
          if (id1 == "WEST UTTAR PRADESH") {
            id1 = "W-UP"
            center.lat = 28
            center.lng = 80
          }
          if (id1 == "UTTARAKHAND") {
            id1 = "UK"
            center.lat = 29.8
            center.lng = 80.3
          }
          if (id1 == "DELHI, HARYANA AND CHANDIGARH") {
            id1 = "DL & HR & CD"
            center.lat = 28.8
            center.lng = 77.1
          }
          if (id1 == "PUNJAB") {
            id1 = "PB"
            center.lat = 30.5
            center.lng = 76.5
          }
          if (id1 == "HIMACHAL PRADESH") {
            id1 = "HP"
            // center.lat = 32.7
            center.lng = 78.3
          }

          if (id1 == "JAMMU & KASHMIR AND LADAKH") {
            id1 = "JK & LA"
            center.lat = 34
            center.lng = 77.5
          }
          if (id1 == "WEST RAJASTHAN") {
            id1 = "W-RJ"
            // center.lat = 27
            center.lng = 74.5
          }

          if (id1 == "EAST RAJASTHAN") {
            id1 = "E-RJ"
            // center.lat = 27
            center.lng = 77
          }
          if (id1 == "ODISHA") {
            id1 = "OD"
            center.lat = 20.5
            center.lng = 85.7
          }
          if (id1 == "WEST MADHYA PRADESH") {
            id1 = "W-MP"
            center.lat = 23
            center.lng = 78.5
          }
          if (id1 == "EAST MADHYA PRADESH") {
            id1 = "E-MP"
            // center.lat = 23.9
             center.lng = 81.5
          }
          if (id1 == "GUJARAT REGION") {
            id1 = "GJ"
            // center.lat = 23.5
            center.lng = 74.3
          }
          if (id1 == "SAURASHTRA & KUTCH") {
            id1 = "SR & KT"
            center.lat = 21.5
            center.lng = 72
          }
          if (id1 == "KONKAN & GOA") {
            id1 = "KN & GA"
            // center.lat = 19.5
            // center.lng = 74
          }
          if (id1 == "MADHYA MAHARASHTRA") {
            id1 = "M-MH"
            center.lat = 17.5
            center.lng = 76
          }
          if (id1 == "MARATHWADA") {
            id1 = "MT"
            center.lat = 18.7
            center.lng = 78
          }
          if (id1 == "VIDARBHA") {
            id1 = "VD"
            // center.lat = 15
             center.lng = 79
          }
          if (id1 == "CHHATTISGARH") {
            id1 = "CG"
            // center.lat = 22
             center.lng = 83
          }
          if (id1 == "ANDAMAN & NICOBAR ISLANDS") {
            id1 = "AN"
            // center.lat = 9.8
             center.lng = 94
          }
          if (id1 == "COASTAL ANDHRA PRADESH & YANAM") {
            id1 = "C-AP & YN"
            // center.lat = 15.5
             center.lng = 82.5
          }
          if (id1 == "TELANGANA") {
            id1 = "TS"
             center.lat = 17.5
             center.lng = 80
          }
          if (id1 == "RAYALSEEMA") {
            id1 = "RS"
            // center.lat = 18
             center.lng = 79
          }
          if (id1 == "TAMILNADU, PUDUCHERRY & KARAIKAL") {
            id1 = "TN & PY & KR"
            // center.lat = 11.5
            center.lng = 80
          }
          if (id1 == "COASTAL KARNATAKA") {
            id1 = "C-KA"
            // center.lat = 15
            // center.lng = 74.7
          }
          if (id1 == "NORTHERN INTERIOR KARNATAKA") {
            id1 = "NI-KA"
            center.lat = 16
            center.lng = 77
          }
          if (id1 == "SOUTHERN INTERIOR KARNATAKA") {
            id1 = "SI-KA"
            center.lat = 12.5
            center.lng = 78
          }
          if (id1 == "KERALA & MAHE") {
            id1 = "KL & ME"
            center.lat = 10.4
            center.lng = 77
          }
          if (id1 == "LAKSHADWEEP") {
            id1 = "LD"
            // center.lat = 10.8
             center.lng = 73.5
          }
          textElement.innerHTML = `
          <div style="text-align: center; line-height: 0.8;">
          <div style="color: #000000; font-weight: bold;text-wrap: nowrap; font-size: 10px; margin-bottom: 3px;">${id1}</div>
          <div style="color: #000000; font-weight: bold;text-wrap: nowrap; font-size: 10px;">${rainfall}mm</div>
          </div>`;
          textElement.classList.add('custom-text-element');
          textElement.style.position = 'absolute';
          textElement.style.left = `${this.map2.latLngToLayerPoint(center).x - 25}px`;
          textElement.style.top = `${this.map2.latLngToLayerPoint(center).y - 10}px`;
          // Set a higher z-index to ensure the text appears on top of the map
          textElement.style.zIndex = '1000';

          // Append the custom HTML element to the map container
          this.map2.getPanes().overlayPane.appendChild(textElement);
          this.addedTextElements.push(textElement);

        }

      });
      // Add the geoJsonLayer to the map
      geoJsonLayer.addTo(this.map2);
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

  downloadMapImage2(): void {
    htmlToImage.toJpeg(document.getElementById('map2') as HTMLElement, { quality: 0.95, filter: this.filter })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'sub-division_dep.jpeg';
        link.href = dataUrl;
        link.click();
      });
  }
}

