import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-normal-district-map',
  templateUrl: './normal-district-map.component.html',
  styleUrls: ['./normal-district-map.component.css']
})
export class NormalDistrictMapComponent {
  inputValue: string = '';
  inputValue1: string = '';
  private initialZoom = 5;
  private map: L.Map = {} as L.Map;
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
  currentDateNormaly: string = '';;
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
    if(this.weeklyDates.length){
      this.weeklyDates.forEach(wd => {
        this.processedData = [];
        var mmmm = wd.substring(0,3);
        var dddd = wd.slice(3);
        const yesterday = new Date(this.today);
        yesterday.setDate(dddd - 1);
        yesterday.setMonth(this.months.indexOf(mmmm));
        const ddy = String(yesterday.getDate());
        const currmonthy = this.months[yesterday.getMonth()];
        var currentDateNormaly = `${currmonthy}${ddy}`;
        for (const item of this.fetchedData) {
          let normal: number
          if(wd === 'Jan1' || wd === 'Mar1' ||wd === 'Jun1' ||wd === 'Oct1'){
            normal = item[wd]
          }
          else{
            normal = (item[wd] - item[currentDateNormaly])
          }
          let den = item[this.currentDateDaily];
          if (item[this.currentDateDaily] == 0) {
            den = 1;
          }
          this.processedData.push({ districtID: item.district_code, Rainfall: normal });
        }
      })
    }else{
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

    // Calculate total daily rainfall for each district
    const result = this.processedData.reduce((acc, current) => {
      const { districtID, Rainfall } = current;

      // If the districtID is already in the accumulator, add the Rainfall to the existing total
      if (acc[districtID]) {
        acc[districtID] += Rainfall;
      } else {
        // If the districtID is not in the accumulator, create a new entry
        acc[districtID] = Rainfall;
      }

      return acc;
    }, {});

    this.processedData.forEach((obj: any) => {
      if (result.hasOwnProperty(obj.districtID)) {
        obj.Rainfall = result[obj.districtID];
      }
    });

  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [26, 76.9629],
      zoom: this.initialZoom,
      scrollWheelZoom: false
    });
    this.map.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map.setZoom(this.initialZoom);
      } else {
        this.map.setZoom(this.initialZoom);
      }
    });
    const fullscreenControl = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },

      content: '<i class="fas fa-expand"></i>'
    });
    this.map.addControl(fullscreenControl);
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





  private loadGeoJSON(): void {
    const propertyName = this.month;
    const propertyName1 = this.day;
    const name = 'name';
    this.http.get('assets/geojson/INDIA_DISTRICT.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);
          const rainfall = matchedData ? matchedData.Rainfall : 0;
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
          const id1 = feature.properties['district'];
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);
          const rainfall = matchedData ? matchedData.Rainfall.toFixed(2) : '0.00';;
          const popupContent = `
            <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
              <div style="color: #002467; font-weight: bold; font-size: 10px;">NORMAL RAINFALL: ${rainfall}mm </div>
            </div>
          `;
          layer.bindPopup(popupContent);
          layer.on('mouseover', () => {
            layer.openPopup();
          });
          layer.on('mouseout', () => {
            layer.closePopup();
          });
        }
      }).addTo(this.map);
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

  downloadMapImage(): void {
    htmlToImage.toJpeg(document.getElementById('map') as HTMLElement, { quality: 0.95, filter: this.filter })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'District_dep.jpeg';
        link.href = dataUrl;
        link.click();
      });
  }
}

