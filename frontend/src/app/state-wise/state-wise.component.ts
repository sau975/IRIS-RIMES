
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { DataService } from '../data.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
import { NavigationEnd, Router } from '@angular/router';
import { EMPTY, concatMap, filter } from 'rxjs';
import { DatePipe } from '@angular/common';
import { IndexedDBService } from 'src/app/indexed-db.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-state-wise',
  templateUrl: './state-wise.component.html',
  styleUrls: ['./state-wise.component.css']
})
export class StateWiseComponent implements AfterViewInit {

  constructor(
    private http: HttpClient,
  ) { }
  // private initialZoom = 4;
  // private lat = 24;
  // private long = 76.9629

  private initialZoom = 9;
  private lat = 28.6;
  private long = 77.1;

  private map: L.Map = {} as L.Map;
  selectedState : String ="ST_DELHI_(UT)";
  selectedStateName : String ="ANDAMAN & NICOBARISLANDS";

  ngAfterViewInit(): void {
    this.initMap();
    this.loadGeoJSON();
  }

  private initMap(): void {
    this.map = L.map('map', {
      // center: [24, 76.9629],
      center: [this.lat, this.long],
      zoom: this.initialZoom,
      scrollWheelZoom: false,
    });

    this.map.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map.setZoom(this.initialZoom + 1);
        // this.map.setView()
        this.loadGeoJSON();
      } else {
        this.map.setZoom(this.initialZoom);
      }
    });
    const fullscreenControl = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },
      content: '<i class="bi bi-arrows-fullscreen"></i>'
    });
    this.map.addControl(fullscreenControl);
    const fullscreenControl1 = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },
      content: '<i class="bi bi-arrows-fullscreen"></i>'
    });}
    private isFullscreen(): boolean {
      return !!(document.fullscreenElement || document.fullscreenElement ||
        document.fullscreenElement || document.fullscreenElement);
    }

  StateList: { name: string, value: string, initZoom : number, lat:number , long:number }[] = [
    {name : 'ANDAMAN & NICOBAR', value : "ST_ANDAMAN_&_NICOBAR_ISLANDS_(UT)", initZoom:6, lat : 10.941450,long :92.878067 },
     {name : 'ANDHRA PRADESH' , value : "ST_ANDHRA_PRADESH", initZoom:6,  lat :15,long :82},
    {name : 'ARUNACHAL PRADESH' , value : "ST_ARUNACHAL_PRADESH", initZoom:7,lat :28,long :95.3},
    {name :   'ASSAM' , value : "ST_ASSAM", initZoom:7, lat :26,long :93},
    {name : 'BIHAR' , value : "ST_BIHAR", initZoom:7, lat :26,long :85},
    {name : 'CHANDIGARH' , value : "ST_CHANDIGARH_(UT)", initZoom:11,lat :30.7,long :76.8},
    {name : 'CHHATTISGARH' , value : "ST_CHHATTISGARH", initZoom:6, lat :21,long :83},
    {name : 'DADAR & NAGAR HAVELI' , value : "ST_DADRA_&_NAGAR_HAVELI_AND_DAMAN_&_DIU_(UT)", initZoom:8, lat :21.0,long :72},
    // // {name : 'DAMAN & DIU' , value : "ST_DELHI_(UT)", initZoom:6, center : [24,76]},
    {name : 'DELHI' , value : "ST_DELHI_(UT)", initZoom:9, lat :28.6,long :77.1},
    {name : 'GOA' , value : "ST_GOA", initZoom:9, lat :15.299326,long :74.12},
    {name : 'GUJARAT' , value : "ST_GUJARAT", initZoom:7, lat :22.2,long :71.12},
    {name : 'HARYANA' , value : "ST_HARYANA", initZoom:7, lat :29,long :76},
    {name : 'HIMACHAL PRADESH' , value : "ST_HIMACHAL_PRADESH", initZoom:7, lat :31.8,long :77.3},
    {name : 'JAMMU AND KASHMIR' , value : "ST_JAMMU_&_KASHMIR_(UT)", initZoom:7, lat :33.7,long :76.5},
    {name : 'JHARKHAND' , value : "ST_JHARKHAND", initZoom:7, lat :24,long :86},
    {name : 'KARNATAKA' , value : "ST_KARNATAKA", initZoom:6, lat :15.3,long :75.7},
    {
      name: 'KERALA',
      value: "ST_KERALA",
      initZoom: 6,
      lat: 10.8505,
      long: 76.2711
  },
  {
      name: 'LADAKH',
      value: "ST_LADAKH_(UT)",
      initZoom: 6,
      lat: 34.1526,
      long: 77.5771
  },
  {
      name: 'LAKSHADWEEP',
      value: "ST_LAKSHADWEEP_(UT)",
      initZoom: 7,
      lat: 10.328,
      long: 72.7847
  },
  {
      name: 'MADHYA PRADESH',
      value: "ST_MADHYA_PRADESH",
      initZoom: 6,
      lat: 22.9734,
      long: 78.6569
  },
  {
      name: 'MAHARASHTRA',
      value: "ST_MAHARASHTRA",
      initZoom: 6,
      lat: 19.7515,
      long: 75.7139
  },
  {
      name: 'MANIPUR',
      value: "ST_MANIPUR",
      initZoom: 7,
      lat: 24.6637,
      long: 93.9063
  },
  {
      name: 'MEGHALAYA',
      value: "ST_MEGHALAYA",
      initZoom: 7,
      lat: 25.467,
      long: 91.3662
  },
  {
      name: 'MIZORAM',
      value: "ST_MIZORAM",
      initZoom: 7,
      lat: 23.1645,
      long: 92.9376
  },
  {
      name: 'NAGALAND',
      value: "ST_NAGALAND",
      initZoom: 7,
      lat: 26.1584,
      long: 94.5624
  },
  {
      name: 'ODISHA',
      value: "ST_ODISHA",
      initZoom: 6,
      lat: 20.9517,
      long: 85.0985
  },
  {
      name: 'PONDICHERRY',
      value: "ST_PUDUCHERRY_(UT)",
      initZoom: 7,
      lat: 11.9416,
      long: 79.8083
  },
  {
      name: 'PUNJAB',
      value: "ST_PUNJAB",
      initZoom: 7,
      lat: 31.1471,
      long: 75.3412
  },
  {
      name: 'RAJASTHAN',
      value: "ST_RAJASTHAN",
      initZoom: 6,
      lat: 27.0238,
      long: 74.2179
  },
  {
      name: 'SIKKIM',
      value: "ST_SIKKIM",
      initZoom: 7,
      lat: 27.533,
      long: 88.5122
  },
  {
      name: 'TAMIL NADU',
      value: "ST_TAMILNADU",
      initZoom: 7,
      lat: 11.1271,
      long: 78.6569
  },
  {
      name: 'TELANGANA',
      value: "ST_TELANGANA",
      initZoom: 7,
      lat: 17.1232,
      long: 79.2088
  },
  {
      name: 'TRIPURA',
      value: "ST_TRIPURA",
      initZoom: 7,
      lat: 23.9408,
      long: 91.9882
  },
  {
      name: 'UTTARAKHAND',
      value: "ST_UTTAR_PRADESH",
      initZoom: 6,
      lat: 28.0668,
      long: 79.0193
  },
  {
      name: 'UTTAR PRADESH',
      value: "ST_UTTARAKHAND",
      initZoom: 7,
      lat: 30.8467,
      long: 80.9462
  },
  {
      name: 'WEST BENGAL',
      value: "ST_WEST_BENGAL",
      initZoom: 6,
      lat: 22.9868,
      long: 87.855
  }
];



onChangeState(event: any) {
  this.selectedState = event.target.value;
  const data = this.StateList.find((d)=>d.value === this.selectedState )
  this.selectedState = event.target.value;

  this.selectedStateName = data?data.name:'';

  this.initialZoom =  data ? data.initZoom: this.initialZoom;
  this.lat =  data ? data.lat: this.lat;
  this.long =  data ? data.long: this.long;
  // this.map.setZoom(this.initialZoom)
  // this.initMap();
  this.map.setView([this.lat,this.long],this.initialZoom);
  this.loadGeoJSON();

  


  // this.http.get(`assets/geojson/state/${this.selectedState}.json`).subscribe((stateRes: any) => {
  //   const stateLayer = L.geoJSON(stateRes, {
  //     style: {
  //       weight: 1,
  //       opacity: 1,
  //       color: 'blue',
  //       fillOpacity: 0
  //     }

  //   }).addTo(this.map);

  // })
 
  console.log('Selected value:', this.selectedState);
}




currentStateLayer: any;

loadGeoJSON(): void {
  if (this.currentStateLayer) {
    this.map.removeLayer(this.currentStateLayer);
  }
  this.http.get(`assets/geojson/state/${this.selectedState}.json`).subscribe((stateRes: any) => {
    const newStateLayer = L.geoJSON(stateRes, {
      style: {
        weight: 1,
        opacity: 1,
        color: 'blue',
        fillOpacity: 0
      }
    });
    // onEachFeauture
    // const bounds = layer.getBounds()
    // const center1 = bounds.getCenter()
    newStateLayer.addTo(this.map);
    this.currentStateLayer = newStateLayer;
  });
}
}
