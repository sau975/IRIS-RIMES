import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'jspdf-autotable';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import * as L from 'leaflet';
import 'leaflet.fullscreen';


@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {

  date: string = String(new Date().getDate());
  month: string = String((new Date().getMonth() + 1).toString().length == 1 ? ('0' + (new Date().getMonth() + 1)) : (new Date().getMonth() + 1));
  year: string = '2024'

  fromDate: Date = new Date();
  toDate: Date = new Date();
  mapTileTypes: string[] = ['District'];
  private initialZoom = 4;
  intervalId :any;
  slidingNo = 0;
  currentSlide = 'INDIA_COUNTRY';
  currentSlideName:String= "";
  isSlider = false;
   slidingMap: L.Map = {} as L.Map;

  // allDaysInMonth:any[]=[];

  constructor(
    private router: Router,
    private http: HttpClient,
    private dataService: DataService
  ) {
    // this.setDateMonth();
    // this.getAllDaysInMonth();
  }

  ngOnInit(): void {
    // this.slidingFunction();
   }

   ngAfterViewInit(): void {
    this.initMap();
   }

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

  private initMap(): void {

    this.slidingMap = L.map('slidingMap', {
      center: [24, 76.9629],
      zoom: this.initialZoom,
      scrollWheelZoom: false,
    });
  }


  toggleSlider(): void {
    this.isSlider = !this.isSlider
}
currentSlidingLayer:any;
  loadSlidingGeoJSON(): void {
    if (this.currentSlidingLayer) {
      this.slidingMap.removeLayer(this.currentSlidingLayer);
    }
    this.http.get(`assets/geojson/${this.currentSlide}.json`).subscribe((stateRes: any) => {
      const newSlidingLayer = L.geoJSON(stateRes, {
        style: {
          weight: 1,
          opacity: 1,
          color: 'blue',
          fillOpacity: 0
        }
      });
      newSlidingLayer.addTo(this.slidingMap);
      this.currentSlidingLayer = newSlidingLayer;
    });
  }

  slidingList : {id:number,region : string, lat:number, long:number,initZoom:number,name:String}[] = [
    {id:0 , region:'INDIA_COUNTRY',lat:24,long:77,initZoom:5, name:""},
    {id:1 , region:'regions/EAST_AND_NORTH_EAST_INDIA',lat:24,long:87,initZoom:6, name:"EAST AND NORTH EAST INDIA"},
    {id:2 , region:'regions/NORTH_WEST_INDIA',lat:30,long:77,initZoom:6, name:"NORTH WEST INDIA"},
    {id:3 , region:'regions/SOUTH_PENINSULA',lat:15,long:77,initZoom:6, name:"SOUTH PENINSULA"},
    {id:4 , region:'regions/C_India',lat:22,long:77,initZoom:6, name:"CENTERAL INDIA"},
  ]

  slidingFunction(): void {

    this.intervalId = setInterval(() => {
      const data = this.slidingList.find((d)=>d.id === this.slidingNo )
      this.currentSlide = data?.region || '';
      this.currentSlideName = data?.name || "";
      this.slidingMap.setView([data?.lat||24,data?.long||77],data?.initZoom||4);
      this.loadSlidingGeoJSON();
      if(this.slidingNo<4){
        this.slidingNo = this.slidingNo + 1
      }else{
        this.slidingNo = 0;
      }
      console.log("interval function " +  this.currentSlide);
    }, 5000); // 5000 milliseconds = 5 seconds
  }



}
