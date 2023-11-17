import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { DataService } from '../../data.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
import { Router } from '@angular/router';
import { distinct } from 'rxjs';

@Component({
  selector: 'app-departure-map',
  templateUrl: './departure-map.component.html',
  styleUrls: ['./departure-map.component.css']
})
export class DepartureMapComponent implements OnInit {
  inputValue: string = '';
  inputValue1: string = '';
  private initialZoom = 4;
  private map: L.Map = {} as L.Map;
  private map1: L.Map = {} as L.Map;
  private map2: L.Map = {} as L.Map;
  private map3: L.Map = {} as L.Map;
  private map4: L.Map = {} as L.Map;
  currentDateNormal: string;
  currentDateDaily: string;
  // inputDateNormal: string;
  // inputDateDaily: string;
  fetchedData: any;
  fetchedData1: any;
  fetchedData2: any;
  fetchedData3: any;
  fetchedData4: any;
  fetchedData5: any;
  fetchedData6: any;
  fetchedMasterData: any;
  currentDateNormaly: string;
  formatteddate: any;
  dd: any;
  constructor(private http: HttpClient, private dataService: DataService, private router: Router) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    this.dd = String(today.getDate());

    const mon = String(today.getMonth() + 1)
    const year = today.getFullYear();
    this.formatteddate = `${this.dd.padStart(2, '0')}-${mon.padStart(2, '0')}-${year}`
    const currmonth = months[today.getMonth()];
    const enddate = `${currmonth}${this.dd}`
    const ddy = String(yesterday.getDate());
    const currmonthy = months[yesterday.getMonth()];

    this.currentDateNormal = `${currmonth}${this.dd}`;
    this.currentDateNormaly = `${currmonthy}${ddy}`;
    this.currentDateDaily = `${this.dd.padStart(2, '0')}_${currmonth}`;

  }
  ngOnInit(): void {
    this.initMap();
    this.loadGeoJSON();
    this.fetchDataFromBackend();
  }
  fetchDataFromBackend(): void {
    this.dataService.fetchData().subscribe({
      next: value => {
        this.fetchedData = value;
        this.processFetchedData();
      },
      error: err => console.error('Error fetching data:', err)
    });

    this.dataService.fetchData1().subscribe({
      next: value => {
        this.fetchedData1 = value;
        this.processFetchedDatastatedaily();
      },
      error: err => console.error('Error fetching data:', err)
    });
    this.dataService.fetchData2().subscribe({
      next: value => {
        this.fetchedData2 = value;
        this.processFetchedDatasubdivdaily();
      },
      error: err => console.error('Error fetching data:', err)
    });
    this.dataService.fetchData3().subscribe({
      next: value => {
        this.fetchedData3 = value;
        this.processFetchedDataregiondaily();
      },
      error: err => console.error('Error fetching data:', err)
    });
    this.dataService.fetchData4().subscribe({
      next: value => {
        this.fetchedData4 = value;
        this.processFetchedDatastatenormal();
      },
      error: err => console.error('Error fetching data:', err)
    });
    this.dataService.fetchData5().subscribe({
      next: value => {
        this.fetchedData5 = value;
        this.processFetchedDatasubdivnormal();
      },
      error: err => console.error('Error fetching data:', err)
    });
    this.dataService.fetchData6().subscribe({
      next: value => {
        this.fetchedData6 = value;
        this.processFetchedDataregionnormal();
      },
      error: err => console.error('Error fetching data:', err)
    });
    this.dataService.fetchMasterFile().subscribe({
      next: value => {
        this.fetchedMasterData = value;
        this.stationtodistrict();
        console.log("value",value)
      },
      error: err => console.error('Error fetching data:', err)
    });

  }
  findMatchingData(id: string): any | null {
    const matchedData = this.processedData.find((data: any) => data.districtID === id);
    return matchedData || null;
  }
  findMatchingDatastate(id: string): any | null {
    const matchedData = this.statefetchedDatadep.find((data: any) => data.statedepid === id);
    return matchedData || null;
  }
  findMatchingDatasubdiv(id: string): any | null {
    const matchedData = this.subdivisionfetchedDatadep.find((data: any) => data.subdivdepid === id);
    return matchedData || null;
  }
  findMatchingDataregion(id: string): any | null {
    const matchedData = this.regionfetchedDatadep.find((data: any) => data.regiondepid === id);
    return matchedData || null;
  }
  findMatchingDatacountry(id: string): any | null {
    const matchedData = this.countryfetcheddata.find((data: any) => data.countryid === id);
    return matchedData || null;
  }
  processedData: any[] = [];
  stationtodistrictdata: any[] = [];
  processedDatacum: any[] = [];
  statefetchedDatadaily: any[] = [];
  statefetchedDatanormal: any[] = [];
  statefetchedDatadep: any[] = [];
  statefetchedDatadepcum: any[] = [];
  statefetchedDatacum: any[] = [];
  subdivisionfetchedDatadaily: any[] = [];
  subdivisionfetchedDatacum: any[] = [];
  subdivisionfetchedDatanormal: any[] = [];
  subdivisionfetchedDatadep: any[] = [];
  subdivisionfetchedDatadepcum: any[] = [];
  regionfetchedDatadaily: any[] = [];
  regionfetchedDatanormal: any[] = [];
  regionfetchedDatadep: any[] = [];
  regionfetchedDatadepcum: any[] = [];
  countryfetcheddata: any[] = [];
  public countrydaily = 0

  stationtodistrict(){
    this.stationtodistrictdata = [];
    let previousdistrictid = null;
    let previousdistrictname = "";
    let districtrainfallsum = 0;
    let numberofdistricts = 0;
    for (const item of this.fetchedMasterData) {
      if(item.districtid == previousdistrictid || previousdistrictid == null){
         districtrainfallsum = districtrainfallsum + item.currentDateDaily
         numberofdistricts = numberofdistricts + 1;
      }
      else{
        this.stationtodistrictdata.push({
          districtid: previousdistrictid,
          districtname: previousdistrictname,
          districtrainfall: districtrainfallsum/numberofdistricts,
          });
      }
       previousdistrictid = item.districtid
       previousdistrictname = item.district_code
    }
  }


  processFetchedDataregiondaily(): void {
    let product = 1;
    let sum = 0;
    let previousregionID = null;
    for (const item of this.fetchedData3) {
      product += item['imdarea_squarekm'] * item[this.currentDateDaily];
      sum += item['imdarea_squarekm'];
      if (previousregionID != item['regionid']) {
        this.countrydaily = this.countrydaily + (product / sum)
        this.regionfetchedDatadaily.push({
          regiondailyid: item['regionid'],
          regiondailyrainfall: product / sum,
        });
        product = 1;
        sum = 0;
      }
      previousregionID = item['regionid'];
    }
  }
  processFetchedDataregionnormal(): void {
    this.regionfetchedDatadep = [];
    for (const item of this.fetchedData6) {
      let normal1: number
      if (this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' || this.currentDateNormal === 'Jun1' || this.currentDateNormal === 'Oct1') {
        normal1 = item[this.currentDateNormal]
      }
      else {
        normal1 = (item[this.currentDateNormal] - item[this.currentDateNormaly])
      }
      this.regionfetchedDatanormal.push({
        regionnormalid: item['regionid'],
        regionnormalrainfall: normal1
      });
      if (item['regionid'] === 1) {
        this.countryfetcheddata.push({ countryid: item['regionid'], countrynormal: normal1, countrydaily: this.countrydaily, countrydep: (this.countrydaily - normal1) / normal1 });
      }
      else {
        const matchedData = this.regionfetchedDatadaily.find((data: any) => data.regiondailyid === item['regionid']);
        if (matchedData) {
          if (this.currentDateNormal.startsWith('Jan') || this.currentDateNormal.startsWith('Feb')) {
            let cumnormalwinter = 0;
            let cumdailywinter = 0;
            let startdate = 'Jan1';
            const today = new Date();
            const months = [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const dd = String(today.getDate());
            const currmonth = months[today.getMonth()];
            let enddate = `${currmonth}${dd}`
            let startMonth = startdate.slice(0, 3);
            let startDay = parseInt(startdate.slice(3));
            let endDay = parseInt(enddate.slice(3));
            let normal: number
            let daily: number
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              const currentDateStrdaily = `${day.toString()}_${startMonth}`;
              if (currentDateStr === 'Jan1') {
                normal = item[currentDateStr]
                daily = item[currentDateStrdaily]
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
              }
              else {
                const yesterday = day - 1;
                const yesterdayStr = `${startMonth}${yesterday.toString()}`;
                const yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = (item[currentDateStrdaily] - item[yesterdayStrdaily])
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
              }
              cumnormalwinter += normal
              cumdailywinter += daily
            }
            if (enddate.slice(0, 3) === 'Feb') {
              startdate = 'Feb1';
              startMonth = startdate.slice(0, 3);
              startDay = parseInt(startdate.slice(3));
              endDay = parseInt(enddate.slice(3));
              for (let day = startDay; day <= endDay; day++) {
                const currentDateStr = `${startMonth}${day.toString()}`;
                //const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                let normal: number
                let daily: number
                let yesterday: number;
                let yesterdayStr: string;
                let yesterdayStrdaily: string;
                if (currentDateStr === 'Feb1') {
                  yesterdayStr = 'Jan31'
                  yesterdayStrdaily = '31_Jan'
                }
                else {
                  yesterday = day - 1;
                  yesterdayStr = `${startMonth}${yesterday.toString()}`;
                  yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                }
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
                cumnormalwinter += normal
                cumdailywinter += daily
              }
            }
            const cumdep = ((cumdailywinter - cumnormalwinter) / cumnormalwinter)
            this.regionfetchedDatadep.push({ regiondepid: item['regionid'], regionname: item.REGION, dailyrainfall: matchedData.regiondailyrainfall, normalrainfall: normal1, regiondeprainfall: (((matchedData.regiondailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalwinter, cummdaily: cumdailywinter, cumdeparture: cumdep });

          }
          else if (this.currentDateNormal.startsWith('Mar') || this.currentDateNormal.startsWith('Apr') || this.currentDateNormal.startsWith('May')) {
            let cumnormalpremon = 0;
            let cumdailypremon = 0;
            let startdate = 'Mar1';
            const today = new Date();
            const months = [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const dd = String(today.getDate());
            const currmonth = months[today.getMonth()];
            let enddate = `${currmonth}${dd}`
            let startMonth = startdate.slice(0, 3);
            let endMonth = enddate.slice(0, 3);
            let startDay = parseInt(startdate.slice(3));
            let endDay = parseInt(enddate.slice(3));
            let normal: number
            let daily: number
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              if (currentDateStr === 'Mar1') {
                normal = item[currentDateStr]
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
              }
              else {
                const yesterday = day - 1;
                const yesterdayStr = `${startMonth}${yesterday.toString()}`;
                const yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
              }
              cumnormalpremon += normal
              cumdailypremon += daily
            }
            if (enddate.slice(0, 3) === 'Apr' || enddate.slice(0, 3) === 'May') {
              startdate = 'Apr1';
              startMonth = startdate.slice(0, 3);
              endMonth = enddate.slice(0, 3);
              startDay = parseInt(startdate.slice(3));
              endDay = parseInt(enddate.slice(3));
              for (let day = startDay; day <= endDay; day++) {
                const currentDateStr = `${startMonth}${day.toString()}`;
                // const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                let normal: number
                let daily: number
                let yesterday: number;
                let yesterdayStr: string;
                let yesterdayStrdaily: string;
                if (currentDateStr === 'Apr1') {
                  yesterdayStr = 'May31'
                  yesterdayStrdaily = '31_May'
                }
                else {
                  yesterday = day - 1;
                  yesterdayStr = `${startMonth}${yesterday.toString()}`;
                  yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                }
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
                cumnormalpremon += normal
                cumdailypremon += daily
              }
            }
            if (enddate.slice(0, 3) === 'Apr' || enddate.slice(0, 3) === 'May') {
              startdate = 'May1';
              enddate = 'May30';
              startMonth = startdate.slice(0, 3);
              startDay = parseInt(startdate.slice(3));
              endDay = parseInt(enddate.slice(3));
              for (let day = startDay; day <= endDay; day++) {
                const currentDateStr = `${startMonth}${day.toString()}`;
                //const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                let normal: number
                let daily: number
                let yesterday: number;
                let yesterdayStr: string;
                let yesterdayStrdaily: string;
                if (currentDateStr === 'May1') {
                  yesterdayStr = 'Apr30'
                  yesterdayStrdaily = '30_Apr'
                }
                else {
                  yesterday = day - 1;
                  yesterdayStr = `${startMonth}${yesterday.toString()}`;
                  yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                }
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
                cumnormalpremon += normal
                cumdailypremon += daily
              }
            }
            const cumdep = ((cumdailypremon - cumnormalpremon) / cumnormalpremon)
            this.regionfetchedDatadep.push({ regiondepid: item['regionid'], regionname: item.REGION, dailyrainfall: matchedData.regiondailyrainfall, normalrainfall: normal1, regiondeprainfall: (((matchedData.regiondailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalpremon, cummdaily: cumdailypremon, cumdeparture: cumdep });
          }
          else if (this.currentDateNormal.startsWith('Jun') || this.currentDateNormal.startsWith('Jul') || this.currentDateNormal.startsWith('Aug') || this.currentDateNormal.startsWith('Sep')) {
            let cumnormalmon = 0;
            let cumdailymon = 0;
            let startdate = 'Jun1';
            const today = new Date();
            const months = [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const dd = String(today.getDate());
            const currmonth = months[today.getMonth()];
            let enddate = `${currmonth}${dd}`
            let startMonth = startdate.slice(0, 3);
            let endMonth = enddate.slice(0, 3);
            let startDay = parseInt(startdate.slice(3));
            let endDay = parseInt(enddate.slice(3));
            let normal: number
            let daily: number
            let cumdep: number
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              if (currentDateStr === 'Jun1') {
                normal = item[currentDateStr]
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
              }
              else {
                const yesterday = day - 1;
                const yesterdayStr = `${startMonth}${yesterday.toString()}`;
                const yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
              }
              cumnormalmon += normal
              cumdailymon += daily
            }
            if (enddate.slice(0, 3) === 'Jul' || enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
              startdate = 'Jul1';
              startMonth = startdate.slice(0, 3);
              endMonth = enddate.slice(0, 3);
              startDay = parseInt(startdate.slice(3));
              endDay = parseInt(enddate.slice(3));
              for (let day = startDay; day <= endDay; day++) {
                const currentDateStr = `${startMonth}${day.toString()}`;
                // const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                let normal: number
                let daily: number
                let yesterday: number;
                let yesterdayStr: string;
                let yesterdayStrdaily: string;
                if (currentDateStr === 'Jul1') {
                  yesterdayStr = 'Jun30'
                  yesterdayStrdaily = '30_Jun'
                }
                else {
                  yesterday = day - 1;
                  yesterdayStr = `${startMonth}${yesterday.toString()}`;
                  yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                }
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
                cumnormalmon += normal
                cumdailymon += daily
              }
            }
            if (enddate.slice(0, 3) === 'Jul' || enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
              startdate = 'Aug1';
              enddate = 'Aug31';
              startMonth = startdate.slice(0, 3);
              endMonth = enddate.slice(0, 3);
              startDay = parseInt(startdate.slice(3));
              endDay = parseInt(enddate.slice(3));
              for (let day = startDay; day <= endDay; day++) {
                const currentDateStr = `${startMonth}${day.toString()}`;
                //const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                let normal: number
                let daily: number
                let yesterday: number;
                let yesterdayStr: string;
                let yesterdayStrdaily: string;
                if (currentDateStr === 'Aug1') {
                  yesterdayStr = 'Jul31'
                  yesterdayStrdaily = '31_Jul'
                }
                else {
                  yesterday = day - 1;
                  yesterdayStr = `${startMonth}${yesterday.toString()}`;
                  yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                }
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
                cumnormalmon += normal
                cumdailymon += daily
              }
            }
            if (enddate.slice(0, 3) === 'Jul' || enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
              startdate = 'Sep1';
              enddate = 'Sep30';
              startMonth = startdate.slice(0, 3);
              startDay = parseInt(startdate.slice(3));
              endDay = parseInt(enddate.slice(3));
              for (let day = startDay; day <= endDay; day++) {
                const currentDateStr = `${startMonth}${day.toString()}`;
                //const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                let normal: number
                let daily: number
                let yesterday: number;
                let yesterdayStr: string;
                let yesterdayStrdaily: string;
                if (currentDateStr === 'Sep1') {
                  yesterdayStr = 'Aug31'
                  yesterdayStrdaily = '31_Aug'
                }
                else {
                  yesterday = day - 1;
                  yesterdayStr = `${startMonth}${yesterday.toString()}`;
                  yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
                }
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
                cumnormalmon += normal
                cumdailymon += daily
              }
            }
            cumdep = ((cumdailymon - cumnormalmon) / cumnormalmon)
            this.regionfetchedDatadep.push({ regiondepid: item['regionid'], regionname: item.REGION, dailyrainfall: matchedData.regiondailyrainfall, normalrainfall: normal1, regiondeprainfall: (((matchedData.regiondailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalmon, cummdaily: cumdailymon, cumdeparture: cumdep });
          }


          else {
            let cumnormalpostmon = 0;
            let cumdailypostmon = 0;
            let startdate = 'Oct1';
            const today = new Date();
            const months = [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const dd = String(today.getDate());
            const currmonth = months[today.getMonth()];
            let enddate = `${currmonth}${dd}`
            let startMonth = startdate.slice(0, 3);
            let startDay = parseInt(startdate.slice(3));
            let endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              let normal: number
              let daily: number
              if (currentDateStr === 'Oct1') {
                normal = item[currentDateStr]
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
              }
              else {
                const yesterday = day - 1;
                const yesterdayStr = `${startMonth}${yesterday.toString()}`;
                const yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
              }
              cumnormalpostmon += normal
              cumdailypostmon += daily
            }
            if (enddate.slice(0, 3) === 'Nov' || enddate.slice(0, 3) === 'Dec') {
              startdate = 'Nov1';
              startMonth = startdate.slice(0, 3);
              startDay = parseInt(startdate.slice(3));
              endDay = parseInt(enddate.slice(3));
              for (let day = startDay; day <= endDay; day++) {
                const currentDateStr = `${startMonth}${day.toString()}`;
                let normal: number
                let daily: number
                let yesterday: number;
                let yesterdayStr: string;
                let yesterdayStrdaily: string;
                if (currentDateStr === 'Nov1') {
                  yesterdayStr = 'Oct31'
                  yesterdayStrdaily = '31_Oct'
                }
                else {
                  yesterday = day - 1;
                  yesterdayStr = `${startMonth}${yesterday.toString()}`;
                  yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
                }
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
                cumnormalpostmon += normal
                cumdailypostmon += daily
              }
            }
            if (enddate.slice(0, 3) === 'Nov' || enddate.slice(0, 3) === 'Dec') {
              startdate = 'Dec1';
              startMonth = startdate.slice(0, 3);
              startDay = parseInt(startdate.slice(3));
              endDay = parseInt(enddate.slice(3));
              for (let day = startDay; day <= endDay; day++) {
                const currentDateStr = `${startMonth}${day.toString()}`;
                let normal: number
                let daily: number
                let yesterday: number;
                let yesterdayStr: string;
                let yesterdayStrdaily: string;
                if (currentDateStr === 'Dec1') {
                  yesterdayStr = 'Nov30'
                  yesterdayStrdaily = '30_Nov'
                }
                else {
                  yesterday = day - 1;
                  yesterdayStr = `${startMonth}${yesterday.toString()}`;
                  yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
                }
                normal = (item[currentDateStr] - item[yesterdayStr])
                daily = matchedData.regiondailyrainfall
                if (Number.isNaN(normal)) {
                  normal = 0;
                }
                if (Number.isNaN(daily)) {
                  daily = 0;
                }
                cumnormalpostmon += normal
                cumdailypostmon += daily
              }
            }
            const cumdep = ((cumdailypostmon - cumnormalpostmon) / cumnormalpostmon)
            this.regionfetchedDatadep.push({ regiondepid: item['regionid'], regionname: item.REGION, dailyrainfall: matchedData.regiondailyrainfall, normalrainfall: normal1, regiondeprainfall: (((matchedData.regiondailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalpostmon, cummdaily: cumdailypostmon, cumdeparture: cumdep });
          }
        }
      }
    }


  }
  processFetchedDatasubdivdaily(): void {
    let product1 = 0;
    let sum1 = 0;
    let previoussubdivId1 = null;
    for (const item of this.fetchedData2) {
      if (previoussubdivId1 === item['subdivid'] || previoussubdivId1 === null) {


        if (this.currentDateDaily.endsWith('Jan') || this.currentDateDaily.endsWith('Feb')) {
          if (this.currentDateDaily.endsWith('Jan') || this.currentDateDaily.endsWith('Feb')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Jan')) {
              endDay = this.dd;
            }
            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Jan'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Feb')) {
            let startDay = 1;
            let endDay = 28;
            if (this.currentDateDaily.endsWith('Feb')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Feb'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
        }
        if (this.currentDateDaily.endsWith('Mar') || this.currentDateDaily.endsWith('Apr') || this.currentDateDaily.endsWith('May')) {
          if (this.currentDateDaily.endsWith('Mar') || this.currentDateDaily.endsWith('Apr') || this.currentDateDaily.endsWith('May')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Mar')) {
              endDay = this.dd;
            }
            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Mar'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Apr') || this.currentDateDaily.endsWith('May')) {
            let startDay = 1;
            let endDay = 30;
            if (this.currentDateDaily.endsWith('Apr')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Apr'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('May')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('May')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_May'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
        }
        if (this.currentDateDaily.endsWith('Jun') || this.currentDateDaily.endsWith('Jul') || this.currentDateDaily.endsWith('Aug')|| this.currentDateDaily.endsWith('Sep')) {
          if (this.currentDateDaily.endsWith('Jun') || this.currentDateDaily.endsWith('Jul') || this.currentDateDaily.endsWith('Aug')|| this.currentDateDaily.endsWith('Sep')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Jun')) {
              endDay = this.dd;
            }
            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Jun'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Jul') || this.currentDateDaily.endsWith('Aug')|| this.currentDateDaily.endsWith('Sep')) {
            let startDay = 1;
            let endDay = 30;
            if (this.currentDateDaily.endsWith('Jul')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Jul'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Aug')|| this.currentDateDaily.endsWith('Sep')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Aug')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Aug'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Sep')) {
            let startDay = 1;
            let endDay = 30;
            if (this.currentDateDaily.endsWith('Sep')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Sep'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
        }
        if (this.currentDateDaily.endsWith('Oct') || this.currentDateDaily.endsWith('Nov') || this.currentDateDaily.endsWith('Dec')) {
          if (this.currentDateDaily.endsWith('Oct') || this.currentDateDaily.endsWith('Nov') || this.currentDateDaily.endsWith('Dec')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Oct')) {
              endDay = this.dd;
            }
            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Oct'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Nov') || this.currentDateDaily.endsWith('Dec')) {
            let startDay = 1;
            let endDay = 30;
            if (this.currentDateDaily.endsWith('Nov')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Nov'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Dec')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Dec')) {
              endDay = this.dd;
            }
            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Dec'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
        }
      }
      else {
        if (previoussubdivId1 !== null) {
          this.subdivisionfetchedDatacum.push({
            subdivdailycumid: previoussubdivId1,
            subdivcumrainfall: product1 / sum1,
            RegionId: item.regionid,
            RegionName: item.region_code
          });
          product1 = 0;
          sum1 = 0;
        }
      }
      product1;
      sum1;
      previoussubdivId1 = item['subdivid'];

    }
    let product = 1;
    let sum = 0;
    let previoussubdivId = null;
    for (const item of this.fetchedData2) {
      if (previoussubdivId === item['subdivid'] || previoussubdivId === null) {
        product += item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum += item['imdarea_squarekm'];
      }
      else {
        if (previoussubdivId !== null) {
          this.subdivisionfetchedDatadaily.push({
            subdivdailyid: previoussubdivId,
            subdivdailyname: item.subdivision_code,
            subdivdailyrainfall: product / sum,
            RegionId: item.regionid,
            RegionName: item.region_code
          });
          product = item['imdarea_squarekm'] * item[this.currentDateDaily];
          sum = item['imdarea_squarekm'];
        }
      }
      product;
      sum;
      previoussubdivId = item['subdivid'];
    }
  }
  processFetchedDatasubdivnormal(): void {
    this.subdivisionfetchedDatadep = [];
    for (const item of this.fetchedData5) {
      let normal1: number
      if (this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' || this.currentDateNormal === 'Jun1' || this.currentDateNormal === 'Oct1') {
        normal1 = item[this.currentDateNormal]
      }
      else {
        normal1 = (item[this.currentDateNormal] - item[this.currentDateNormaly])
      }
      this.subdivisionfetchedDatanormal.push({
        subdivnormalid: item['subdivid'],
        subdivnormalrainfall: normal1
      });
      const matchedData = this.subdivisionfetchedDatadaily.find((data: any) => data.subdivdailyid === item['subdivid']);
      const matchedData1 = this.subdivisionfetchedDatacum.find((data: any) => data.subdivdailycumid === item['subdivid']);
      if (matchedData) {
        if (this.currentDateNormal.startsWith('Jan') || this.currentDateNormal.startsWith('Feb')) {
          let cumnormalwinter = 0;
          let cumdailywinter = 0;
          let startdate = 'Jan1';
          const today = new Date();
          const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
          const dd = String(today.getDate());
          const currmonth = months[today.getMonth()];
          let enddate = `${currmonth}${dd}`
          let startMonth = startdate.slice(0, 3);
          let startDay = parseInt(startdate.slice(3));
          let endDay = parseInt(enddate.slice(3));
          let normal: number
          let daily: number
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString()}_${startMonth}`;
            if (currentDateStr === 'Jan1') {
              normal = item[currentDateStr]
              daily = item[currentDateStrdaily]
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            else {
              const yesterday = day - 1;
              const yesterdayStr = `${startMonth}${yesterday.toString()}`;
              const yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = (item[currentDateStrdaily] - item[yesterdayStrdaily])
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            cumnormalwinter += normal
            cumdailywinter += daily
          }
          if (enddate.slice(0, 3) === 'Feb') {
            startdate = 'Feb1';
            startMonth = startdate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              //const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Feb1') {
                yesterdayStr = 'Jan31'
                yesterdayStrdaily = '31_Jan'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalwinter += normal
              cumdailywinter += daily
            }
          }
          const cumdep = ((cumdailywinter - cumnormalwinter) / cumnormalwinter)
          this.subdivisionfetchedDatadep.push({ subdivdepid: item['subdivid'], subdivname: item.SUBDIVISION, regionid: matchedData.RegionId, regionname: matchedData.RegionName, dailyrainfall: matchedData.subdivdailyrainfall, normalrainfall: normal1, subdivdeprainfall: (((matchedData.subdivdailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalwinter, cummdaily: cumdailywinter, cumdeparture: cumdep });
        }
        else if (this.currentDateNormal.startsWith('Mar') || this.currentDateNormal.startsWith('Apr') || this.currentDateNormal.startsWith('May')) {
          let cumnormalpremon = 0;
          let cumdailypremon = 0;
          let startdate = 'Mar1';
          const today = new Date();
          const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
          const dd = String(today.getDate());
          const currmonth = months[today.getMonth()];
          let enddate = `${currmonth}${dd}`
          let startMonth = startdate.slice(0, 3);
          let endMonth = enddate.slice(0, 3);
          let startDay = parseInt(startdate.slice(3));
          let endDay = parseInt(enddate.slice(3));
          let normal: number
          let daily: number
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            if (currentDateStr === 'Mar1') {
              normal = item[currentDateStr]
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            else {
              const yesterday = day - 1;
              const yesterdayStr = `${startMonth}${yesterday.toString()}`;
              const yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            cumnormalpremon += normal
            cumdailypremon += daily
          }
          if (enddate.slice(0, 3) === 'Apr' || enddate.slice(0, 3) === 'May') {
            startdate = 'Apr1';
            startMonth = startdate.slice(0, 3);
            endMonth = enddate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Apr1') {
                yesterdayStr = 'Mar31'
                yesterdayStrdaily = '31_Mar'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalpremon += normal
              cumdailypremon += daily
            }
          }
          if (enddate.slice(0, 3) === 'Apr' || enddate.slice(0, 3) === 'May') {
            startdate = 'May1';
            startMonth = startdate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              //const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Sep1') {
                yesterdayStr = 'Aug31'
                yesterdayStrdaily = '31_Aug'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalpremon += normal
              cumdailypremon += daily
            }
          }
          const cumdep = ((cumdailypremon - cumnormalpremon) / cumnormalpremon)
          this.subdivisionfetchedDatadep.push({ subdivdepid: item['subdivid'], subdivname: item.SUBDIVISION, regionid: matchedData.RegionId, regionname: matchedData.RegionName, dailyrainfall: matchedData.subdivdailyrainfall, normalrainfall: normal1, subdivdeprainfall: (((matchedData.subdivdailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalpremon, cummdaily: cumdailypremon, cumdeparture: cumdep });
        }
        else if (this.currentDateNormal.startsWith('Jun') || this.currentDateNormal.startsWith('Jul') || this.currentDateNormal.startsWith('Aug') || this.currentDateNormal.startsWith('Sep')) {
          let cumnormalmon = 0;
          let cumdailymon = 0;
          let startdate = 'Jun1';
          const today = new Date();
          const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
          const dd = String(today.getDate());
          const currmonth = months[today.getMonth()];
          let enddate = `${currmonth}${dd}`
          let startMonth = startdate.slice(0, 3);
          let endMonth = enddate.slice(0, 3);
          let startDay = parseInt(startdate.slice(3));
          let endDay = parseInt(enddate.slice(3));
          let normal: number
          let daily: number
          let cumdep: number
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            if (currentDateStr === 'Jun1') {
              normal = item[currentDateStr]
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            else {
              const yesterday = day - 1;
              const yesterdayStr = `${startMonth}${yesterday.toString()}`;
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            cumnormalmon += normal
            cumdailymon += daily
          }
          if (enddate.slice(0, 3) === 'Jul' || enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
            startdate = 'Jul1';
            startMonth = startdate.slice(0, 3);
            endMonth = enddate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Jul1') {
                yesterdayStr = 'Jun30'
                yesterdayStrdaily = '30_Jun'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalmon += normal
              cumdailymon += daily
            }
          }
          if (enddate.slice(0, 3) === 'Jul' || enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
            startdate = 'Aug1';
            startMonth = startdate.slice(0, 3);
            endMonth = enddate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Aug1') {
                yesterdayStr = 'Jul31'
                yesterdayStrdaily = '31_Jul'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalmon += normal
              cumdailymon += daily
            }
          }
          if (enddate.slice(0, 3) === 'Jul' || enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
            startdate = 'Sep1';
            startMonth = startdate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Sep1') {
                yesterdayStr = 'Aug31'
                yesterdayStrdaily = '31_Aug'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalmon += normal
              cumdailymon += daily
            }
          }
          cumdep = ((cumdailymon - cumnormalmon) / cumnormalmon)
          this.subdivisionfetchedDatadep.push({ subdivdepid: item['subdivid'], subdivname: item.SUBDIVISION, regionid: matchedData.RegionId, regionname: matchedData.RegionName, dailyrainfall: matchedData.subdivdailyrainfall, normalrainfall: normal1, subdivdeprainfall: (((matchedData.subdivdailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalmon, cummdaily: cumdailymon, cumdeparture: cumdep });
        }


        else {
          let cumnormalpostmon = 0;
          let cumdailypostmon = 0;
          let startdate = 'Oct1';
          const today = new Date();
          const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
          const dd = String(today.getDate());
          const currmonth = months[today.getMonth()];
          let enddate = `${currmonth}${dd}`
          let startMonth = startdate.slice(0, 3);
          let startDay = parseInt(startdate.slice(3));
          let endDay = parseInt(enddate.slice(3));
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString()}_${startMonth}`;
            let normal: number
            let daily: number
            if (currentDateStr === 'Oct1') {
              normal = item[currentDateStr]
              daily = matchedData1.subdivcumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            else {
              const yesterday = day - 1;
              const yesterdayStr = `${startMonth}${yesterday.toString()}`;
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData1.subdivcumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            cumnormalpostmon += normal

          }
          if (enddate.slice(0, 3) === 'Nov' || enddate.slice(0, 3) === 'Dec') {
            startdate = 'Nov1';
            enddate = 'Nov30';
            startMonth = startdate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Nov1') {
                yesterdayStr = 'Oct31'
                yesterdayStrdaily = '31_Oct'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalpostmon += normal
              cumdailypostmon += daily
            }
          }
          if (enddate.slice(0, 3) === 'Nov' || enddate.slice(0, 3) === 'Dec') {
            startdate = 'Dec1';
            startMonth = startdate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Dec1') {
                yesterdayStr = 'Nov30'
                yesterdayStrdaily = '30_Nov'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.subdivdailyrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalpostmon += normal
              cumdailypostmon += daily
            }
          }
          const cumdep = ((matchedData1.subdivcumrainfall - cumnormalpostmon) / cumnormalpostmon) * 100
          this.subdivisionfetchedDatadep.push({ subdivdepid: matchedData.subdivdailyid , subdivname: matchedData.subdivdailyname , regionid: matchedData.RegionId, regionname: matchedData.RegionName, dailyrainfall: matchedData.subdivdailyrainfall, normalrainfall: normal1, subdivdeprainfall: (((matchedData.subdivdailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalpostmon, cummdaily: matchedData1.subdivcumrainfall, cumdeparture: cumdep });
        }
      }
    }
  }
  processFetchedDatastatedaily(): void {
    let product1 = 0;
    let sum1 = 0;
    let previousStateId1 = null;
    for (const item of this.fetchedData1) {
      if (previousStateId1 === item['stateid'] || previousStateId1 === null) {
        if (this.currentDateDaily.endsWith('Jan') || this.currentDateDaily.endsWith('Feb')) {
          if (this.currentDateDaily.endsWith('Jan') || this.currentDateDaily.endsWith('Feb')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Jan')) {
              endDay = this.dd;
            }
            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Jan'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Feb')) {
            let startDay = 1;
            let endDay = 28;
            if (this.currentDateDaily.endsWith('Feb')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Feb'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
        }
        if (this.currentDateDaily.endsWith('Mar') || this.currentDateDaily.endsWith('Apr') || this.currentDateDaily.endsWith('May')) {
          if (this.currentDateDaily.endsWith('Mar') || this.currentDateDaily.endsWith('Apr') || this.currentDateDaily.endsWith('May')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Mar')) {
              endDay = this.dd;
            }
            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Mar'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Apr') || this.currentDateDaily.endsWith('May')) {
            let startDay = 1;
            let endDay = 30;
            if (this.currentDateDaily.endsWith('Apr')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Apr'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('May')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('May')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_May'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
        }
        if (this.currentDateDaily.endsWith('Jun') || this.currentDateDaily.endsWith('Jul') || this.currentDateDaily.endsWith('Aug')|| this.currentDateDaily.endsWith('Sep')) {
          if (this.currentDateDaily.endsWith('Jun') || this.currentDateDaily.endsWith('Jul') || this.currentDateDaily.endsWith('Aug')|| this.currentDateDaily.endsWith('Sep')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Jun')) {
              endDay = this.dd;
            }
            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Jun'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Jul') || this.currentDateDaily.endsWith('Aug')|| this.currentDateDaily.endsWith('Sep')) {
            let startDay = 1;
            let endDay = 30;
            if (this.currentDateDaily.endsWith('Jul')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Jul'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Aug')|| this.currentDateDaily.endsWith('Sep')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Aug')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Aug'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Sep')) {
            let startDay = 1;
            let endDay = 30;
            if (this.currentDateDaily.endsWith('Sep')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Sep'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
        }
        if (this.currentDateDaily.endsWith('Oct') || this.currentDateDaily.endsWith('Nov') || this.currentDateDaily.endsWith('Dec')) {
          if (this.currentDateDaily.endsWith('Oct') || this.currentDateDaily.endsWith('Nov') || this.currentDateDaily.endsWith('Dec')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Oct')) {
              endDay = this.dd;
            }
            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Oct'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Nov') || this.currentDateDaily.endsWith('Dec')) {
            let startDay = 1;
            let endDay = 30;
            if (this.currentDateDaily.endsWith('Nov')) {
              endDay = this.dd;
            }

            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Nov'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
          if (this.currentDateDaily.endsWith('Dec')) {
            let startDay = 1;
            let endDay = 31;
            if (this.currentDateDaily.endsWith('Dec')) {
              endDay = this.dd;
            }
            sum1 += item['imdarea_squarekm'];
            for (let day = startDay; day <= endDay; day++) {
              const v = day.toString().padStart(2, '0') + '_Dec'
              product1 += item['imdarea_squarekm'] * item[v]

            }
          }
        }
      }

      else {
        if (previousStateId1 !== null) {
          this.statefetchedDatacum.push({
            statedailycumid: previousStateId1,
            statedailycumrainfall: product1 / sum1,
            RegionId: item.regionid,
            RegionName: item.region_code
          });
          product1 = 0;
          sum1 = 0;
        }
      }

      product1;
      sum1;
      previousStateId1 = item['stateid'];

    }


    let product = 0;
    let sum = 0;
    let previousStateId = null;
    let previousStatename = null;
    let previousregionid = null;
    let previousregionname = null;

    for (const item of this.fetchedData1) {
      if (previousStateId === item['stateid'] || previousStateId === null) {
        if (Number.isNaN(item[this.currentDateDaily]) || Number.isNaN(item['imdarea_squarekm'])) {
          product += 0
          sum += 0
        }
        else {
          product += item['imdarea_squarekm'] * item[this.currentDateDaily];
          sum += item['imdarea_squarekm'];
        }
      }
      else {
        if (previousStateId !== null) {
          this.statefetchedDatadaily.push({
            statedailyid: previousStateId,
            statedailyname : previousStatename,
            statedailyrainfall: product / sum,
            RegionId: previousregionid,
            RegionName: previousregionname
          });
          product = item['imdarea_squarekm'] * item[this.currentDateDaily];
          sum = item['imdarea_squarekm'];
        }
      }
      product;
      sum;
      previousStateId = item['stateid'];
      previousStatename = item.state_code;
      previousregionid = item.regionid;
      previousregionname = item.region_code
    }
  }

  processFetchedDatastatenormal(): void {
    this.statefetchedDatadep = [];
    for (const item of this.fetchedData4) {
      let normal1: number
      if (this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' || this.currentDateNormal === 'Jun1' || this.currentDateNormal === 'Oct1') {
        normal1 = item[this.currentDateNormal]
      }
      else {
        normal1 = (item[this.currentDateNormal] - item[this.currentDateNormaly])
      }
      this.statefetchedDatanormal.push({
        statenormalid: item['state_id'],
        statenormalrainfall: normal1
      });
      const matchedData = this.statefetchedDatadaily.find((data: any) => data.statedailyid === item['state_id']);
      const matchedData1 = this.statefetchedDatacum.find((data: any) => data.statedailycumid === item['state_id']);

      if (matchedData) {
        if (this.currentDateNormal.startsWith('Jan') || this.currentDateNormal.startsWith('Feb')) {
          let cumnormalwinter = 0;
          let cumdailywinter = 0;
          let startdate = 'Jan1';
          const today = new Date();
          const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
          const dd = String(today.getDate());
          const currmonth = months[today.getMonth()];
          let enddate = `${currmonth}${dd}`
          let startMonth = startdate.slice(0, 3);
          let startDay = parseInt(startdate.slice(3));
          let endDay = parseInt(enddate.slice(3));
          let normal: number
          let daily: number
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            if (currentDateStr === 'Jan1') {
              normal = item[currentDateStr]
              daily = item[currentDateStrdaily]
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            else {
              const yesterday = day - 1;
              const yesterdayStr = `${startMonth}${yesterday.toString()}`;
              const yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData1.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            cumnormalwinter += normal
            cumdailywinter += daily
          }
          if (enddate.slice(0, 3) === 'Feb') {
            startdate = 'Feb1';
            startMonth = startdate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              //const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Feb1') {
                yesterdayStr = 'Jan31'
                yesterdayStrdaily = '31_Jan'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData1.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalwinter += normal
              cumdailywinter += daily
            }
          }
          const cumdep = ((cumdailywinter - cumnormalwinter) / cumnormalwinter)
          this.statefetchedDatadep.push({ statedepid: item['state_id'], statename: item.state, regionid: matchedData.RegionId, regionname: matchedData.RegionName, dailyrainfall: matchedData.statedailyrainfall, normalrainfall: normal1, statedeprainfall: (((matchedData.statedailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalwinter, cummdaily: cumdailywinter, cumdeparture: cumdep });
        }
        else if (this.currentDateNormal.startsWith('Mar') || this.currentDateNormal.startsWith('Apr') || this.currentDateNormal.startsWith('May')) {
          let cumnormalpremon = 0;
          let cumdailypremon = 0;
          let startdate = 'Mar1';
          const today = new Date();
          const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
          const dd = String(today.getDate());
          const currmonth = months[today.getMonth()];
          let enddate = `${currmonth}${dd}`
          let startMonth = startdate.slice(0, 3);
          let endMonth = enddate.slice(0, 3);
          let startDay = parseInt(startdate.slice(3));
          let endDay = parseInt(enddate.slice(3));
          let normal: number
          let daily: number
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            if (currentDateStr === 'Mar1') {
              normal = item[currentDateStr]
              daily = matchedData.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            else {
              const yesterday = day - 1;
              const yesterdayStr = `${startMonth}${yesterday.toString()}`;
              const yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            cumnormalpremon += normal
            cumdailypremon += daily
          }
          if (enddate.slice(0, 3) === 'Apr' || enddate.slice(0, 3) === 'May') {
            startdate = 'Apr1';
            endMonth = enddate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              // const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Apr1') {
                yesterdayStr = 'Mar30'
                yesterdayStrdaily = '30_Mar'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalpremon += normal
              cumdailypremon += daily
            }
          }
          if (enddate.slice(0, 3) === 'Apr' || enddate.slice(0, 3) === 'May') {
            startdate = 'May1';
            enddate = 'May30';
            startMonth = startdate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              //const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'May1') {
                yesterdayStr = 'Apr30'
                yesterdayStrdaily = '30_Apr'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalpremon += normal
              cumdailypremon += daily
            }
          }
          const cumdep = ((cumdailypremon - cumnormalpremon) / cumnormalpremon)

          this.statefetchedDatadep.push({ statedepid: item['state_id'], statename: item.state, regionid: matchedData.RegionId, regionname: matchedData.RegionName, dailyrainfall: matchedData.statedailyrainfall, normalrainfall: normal1, statedeprainfall: (((matchedData.statedailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalpremon, cummdaily: cumdailypremon, cumdeparture: cumdep });
        }
        else if (this.currentDateNormal.startsWith('Jun') || this.currentDateNormal.startsWith('Jul') || this.currentDateNormal.startsWith('Aug') || this.currentDateNormal.startsWith('Sep')) {
          let cumnormalmon = 0;
          let cumdailymon = 0;
          let startdate = 'Jun1';
          const today = new Date();
          const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
          const dd = String(today.getDate());
          const currmonth = months[today.getMonth()];
          let enddate = `${currmonth}${dd}`
          let startMonth = startdate.slice(0, 3);
          let endMonth = enddate.slice(0, 3);
          let startDay = parseInt(startdate.slice(3));
          let endDay = parseInt(enddate.slice(3));
          let normal: number
          let daily: number
          let cumdep: number
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            // const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;

            if (currentDateStr === 'Jun1') {
              normal = item[currentDateStr]
              daily = matchedData.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            else {
              const yesterday = day - 1;
              const yesterdayStr = `${startMonth}${yesterday.toString()}`;
              const yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
            }
            cumnormalmon += normal
            cumdailymon += daily
          }
          if (enddate.slice(0, 3) === 'Jul' || enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
            startdate = 'Jul1';
            startMonth = startdate.slice(0, 3);
            endMonth = enddate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              // const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Jul1') {
                yesterdayStr = 'Jun30'
                yesterdayStrdaily = '30_Jun'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalmon += normal
              cumdailymon += daily
            }
          }
          if (enddate.slice(0, 3) === 'Jul' || enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
            startdate = 'Aug1';
            startMonth = startdate.slice(0, 3);
            endMonth = enddate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Aug1') {
                yesterdayStr = 'Jul31'
                yesterdayStrdaily = '31_Jul'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalmon += normal
              cumdailymon += daily
            }
          }
          if (enddate.slice(0, 3) === 'Jul' || enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
            startdate = 'Sep1';
            startMonth = startdate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              //const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Sep1') {
                yesterdayStr = 'Aug31'
                yesterdayStrdaily = '31_Aug'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalmon += normal
              cumdailymon += daily
            }
          }
          cumdep = ((cumdailymon - cumnormalmon) / cumnormalmon)

          this.statefetchedDatadep.push({ statedepid: item['state_id'], statename: item.state, regionid: matchedData.RegionId, regionname: matchedData.RegionName, dailyrainfall: matchedData.statedailyrainfall, normalrainfall: normal1, statedeprainfall: (((matchedData.statedailyrainfall - normal1) / normal1) * 100), cummnormal: cumnormalmon, cummdaily: cumdailymon, cumdeparture: cumdep });

        }

        else {
          let cumnormalpostmon = 0;
          let cumdailypostmon = 0;
          let startdate = 'Oct1';
          const today = new Date();
          const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];
          const dd = String(today.getDate());
          const currmonth = months[today.getMonth()];
          let enddate = `${currmonth}${dd}`
          let startMonth = startdate.slice(0, 3);
          let startDay = parseInt(startdate.slice(3));
          let endDay = parseInt(enddate.slice(3));
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;

            let normal: number
            let daily: number
            if (currentDateStr === 'Oct1') {
              normal = item[currentDateStr]
              if (Number.isNaN(normal)) {
                normal = 0;
              }

            }
            else {
              const yesterday = day - 1;
              const yesterdayStr = `${startMonth}${yesterday.toString()}`;
              const yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData1.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
            }
            cumnormalpostmon += normal
          }
          if (enddate.slice(0, 3) === 'Nov' || enddate.slice(0, 3) === 'Dec') {
            startdate = 'Nov1';
            startMonth = startdate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Nov1') {
                yesterdayStr = 'Oct31'
                yesterdayStrdaily = '31_Oct'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = (item[currentDateStrdaily] - item[yesterdayStrdaily])
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalpostmon += normal
              cumdailypostmon += daily
            }
          }
          if (enddate.slice(0, 3) === 'Nov' || enddate.slice(0, 3) === 'Dec') {
            startdate = 'Dec1';
            enddate = 'Dec31';
            startMonth = startdate.slice(0, 3);
            startDay = parseInt(startdate.slice(3));
            endDay = parseInt(enddate.slice(3));
            for (let day = startDay; day <= endDay; day++) {
              const currentDateStr = `${startMonth}${day.toString()}`;
              //const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              let normal: number
              let daily: number
              let yesterday: number;
              let yesterdayStr: string;
              let yesterdayStrdaily: string;
              if (currentDateStr === 'Dec1') {
                yesterdayStr = 'Nov30'
                yesterdayStrdaily = '30_Nov'
              }
              else {
                yesterday = day - 1;
                yesterdayStr = `${startMonth}${yesterday.toString()}`;
                yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
              }
              normal = (item[currentDateStr] - item[yesterdayStr])
              daily = matchedData1.statedailycumrainfall
              if (Number.isNaN(normal)) {
                normal = 0;
              }
              if (Number.isNaN(daily)) {
                daily = 0;
              }
              cumnormalpostmon += normal
              cumdailypostmon += daily
            }

          }
          const cumdep = ((matchedData1.statedailycumrainfall - cumnormalpostmon) / cumnormalpostmon) * 100
          let den = 0;
          if (matchedData.statedailyrainfall === 0) {
            den = 0.01;
          }
          else {
            den = matchedData.statedailyrainfall
          }
          this.statefetchedDatadep.push({ statedepid: matchedData.statedailyid, statename: matchedData.statedailyname, regionid: matchedData.RegionId, regionname: matchedData.RegionName, dailyrainfall: matchedData.statedailyrainfall, normalrainfall: normal1, statedeprainfall: (((den - normal1) / normal1) * 100), cummnormal: cumnormalpostmon, cummdaily: matchedData1.statedailycumrainfall, cumdeparture: cumdep });
        }
      }

    }
  }
  processFetchedData(): void {
    this.processedData = [];
    for (const item of this.fetchedData) {
      let normal1: number
      if (this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' || this.currentDateNormal === 'Jun1' || this.currentDateNormal === 'Oct1') {
        normal1 = item[this.currentDateNormal]
      }
      else {
        normal1 = (item[this.currentDateNormal] - item[this.currentDateNormaly])
      }
      if (this.currentDateNormal.startsWith('Jan') || this.currentDateNormal.startsWith('Feb')) {
        let cumnormalwinter = 0;
        let cumdailywinter = 0;
        let startdate = 'Jan1';
        const today = new Date();
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const dd = String(today.getDate());
        const currmonth = months[today.getMonth()];
        let enddate = `${currmonth}${dd}`
        let startMonth = startdate.slice(0, 3);
        let startDay = parseInt(startdate.slice(3));
        let endDay = parseInt(enddate.slice(3));
        let normal: number
        let daily: number
        for (let day = startDay; day <= endDay; day++) {
          const currentDateStr = `${startMonth}${day.toString()}`;
          const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
          if (currentDateStr === 'Jan1') {
            normal = item[currentDateStr]
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
          }
          else {
            const yesterday = day - 1;
            const yesterdayStr = `${startMonth}${yesterday.toString()}`;
            const yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = (item[currentDateStrdaily] - item[yesterdayStrdaily])
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
          }
          cumnormalwinter += normal
          cumdailywinter += daily
        }
        if (enddate.slice(0, 3) === 'Feb') {
          startdate = 'Feb1';
          enddate = 'Feb29';
          startMonth = startdate.slice(0, 3);
          startDay = parseInt(startdate.slice(3));
          endDay = parseInt(enddate.slice(3));
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            let normal: number
            let daily: number
            let yesterday: number;
            let yesterdayStr: string;
            let yesterdayStrdaily: string;
            if (currentDateStr === 'Feb1') {
              yesterdayStr = 'Jan31'
              yesterdayStrdaily = '31_Jan'
            }
            else {
              yesterday = day - 1;
              yesterdayStr = `${startMonth}${yesterday.toString()}`;
              yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            }
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
            cumnormalwinter += normal
            cumdailywinter += daily
          }
        }
        const cumdep = ((cumdailywinter - cumnormalwinter) / cumnormalwinter)
        this.processedData.push({ districtID: item.districtid, districtname: item.DISTRICT, statename: item.state_code, subdivisionname: item.subdivision_code, dailyrainfall: item[this.currentDateDaily], normalrainfall: normal1, Rainfall: (((item[this.currentDateDaily] - normal1) / normal1) * 100), cummnormal: cumnormalwinter, cummdaily: cumdailywinter, cumdeparture: cumdep });
      }
      else if (this.currentDateNormal.startsWith('Mar') || this.currentDateNormal.startsWith('Apr') || this.currentDateNormal.startsWith('May')) {
        let cumnormalpremon = 0;
        let cumdailypremon = 0;
        let startdate = 'Mar1';
        const today = new Date();
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const dd = String(today.getDate());
        const currmonth = months[today.getMonth()];
        let enddate = `${currmonth}${dd}`
        let startMonth = startdate.slice(0, 3);
        let endMonth = enddate.slice(0, 3);
        let startDay = parseInt(startdate.slice(3));
        let endDay = parseInt(enddate.slice(3));
        let normal: number;
        let daily: number;
        for (let day = startDay; day <= endDay; day++) {
          const currentDateStr = `${startMonth}${day.toString()}`;
          const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
          if (currentDateStr === 'Mar1') {
            normal = item[currentDateStr]
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
          }
          else {
            const yesterday = day - 1;
            const yesterdayStr = `${startMonth}${yesterday.toString()}`;
            const yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
          }
          cumnormalpremon += normal
          cumdailypremon += daily
        }
        if (enddate.slice(0, 3) === 'Apr' || enddate.slice(0, 3) === 'May') {
          startdate = 'Apr1';
          startMonth = startdate.slice(0, 3);
          endMonth = enddate.slice(0, 3);
          startDay = parseInt(startdate.slice(3));
          endDay = parseInt(enddate.slice(3));
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            let normal: number
            let daily: number
            let yesterday: number;
            let yesterdayStr: string;
            let yesterdayStrdaily: string;
            if (currentDateStr === 'Apr1') {
              yesterdayStr = 'Mar31'
              yesterdayStrdaily = '31_Mar'
            }
            else {
              yesterday = day - 1;
              yesterdayStr = `${startMonth}${yesterday.toString()}`;
              yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            }
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
            cumnormalpremon += normal
            cumdailypremon += daily
          }
        }
        if (enddate.slice(0, 3) === 'May') {
          startdate = 'May1';
          startMonth = startdate.slice(0, 3);
          startDay = parseInt(startdate.slice(3));
          endDay = parseInt(enddate.slice(3));
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            let normal: number
            let daily: number
            let yesterday: number;
            let yesterdayStr: string;
            let yesterdayStrdaily: string;
            if (currentDateStr === 'May1') {
              yesterdayStr = 'Apr30'
              yesterdayStrdaily = '30_Apr'
            }
            else {
              yesterday = day - 1;
              yesterdayStr = `${startMonth}${yesterday.toString()}`;
              yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            }
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
            cumnormalpremon += normal
            cumdailypremon += daily
          }
        }
        const cumdep = ((cumdailypremon - cumnormalpremon) / cumnormalpremon)
        this.processedData.push({ districtID: item.districtid, districtname: item.DISTRICT, statename: item.state_code, subdivisionname: item.subdivision_code, dailyrainfall: item[this.currentDateDaily], normalrainfall: normal1, Rainfall: (((item[this.currentDateDaily] - normal1) / normal1) * 100), cummnormal: cumnormalpremon, cummdaily: cumdailypremon, cumdeparture: cumdep });
      }
      else if (this.currentDateNormal.startsWith('Jun') || this.currentDateNormal.startsWith('Jul') || this.currentDateNormal.startsWith('Aug') || this.currentDateNormal.startsWith('Sep')) {
        let cumnormalmon = 0;
        let cumdailymon = 0;
        let startdate = 'Jun1';
        const today = new Date();
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const dd = String(today.getDate());
        const currmonth = months[today.getMonth()];
        let enddate = `${currmonth}${dd}`
        let startMonth = startdate.slice(0, 3);
        let endMonth = enddate.slice(0, 3);
        let startDay = parseInt(startdate.slice(3));
        let endDay = parseInt(enddate.slice(3));
        let normal: number
        let daily: number
        let cumdep: number
        for (let day = startDay; day <= endDay; day++) {
          const currentDateStr = `${startMonth}${day.toString()}`;
          const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
          if (currentDateStr === 'Jun1') {
            normal = item[currentDateStr]
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
          }
          else {
            const yesterday = day - 1;
            const yesterdayStr = `${startMonth}${yesterday.toString()}`;
            const yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
          }
          cumnormalmon += normal
          cumdailymon += daily
        }
        if (enddate.slice(0, 3) === 'Jul' || enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
          startdate = 'Jul1';
          startMonth = startdate.slice(0, 3);
          endMonth = enddate.slice(0, 3);
          startDay = parseInt(startdate.slice(3));
          endDay = parseInt(enddate.slice(3));
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            let normal: number
            let daily: number
            let yesterday: number;
            let yesterdayStr: string;
            let yesterdayStrdaily: string;
            if (currentDateStr === 'Jul1') {
              yesterdayStr = 'Jun30'
              yesterdayStrdaily = '30_Jun'
            }
            else {
              yesterday = day - 1;
              yesterdayStr = `${startMonth}${yesterday.toString()}`;
              yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            }
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
            cumnormalmon += normal
            cumdailymon += daily
          }
        }
        if (enddate.slice(0, 3) === 'Aug' || enddate.slice(0, 3) === 'Sep') {
          startdate = 'Aug1';
          enddate = 'Aug31';
          startMonth = startdate.slice(0, 3);
          endMonth = enddate.slice(0, 3);
          startDay = parseInt(startdate.slice(3));
          endDay = parseInt(enddate.slice(3));
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            let normal: number
            let daily: number
            let yesterday: number;
            let yesterdayStr: string;
            let yesterdayStrdaily: string;
            if (currentDateStr === 'Aug1') {
              yesterdayStr = 'Jul31'
              yesterdayStrdaily = '31_Jul'
            }
            else {
              yesterday = day - 1;
              yesterdayStr = `${startMonth}${yesterday.toString()}`;
              yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            }
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
            cumnormalmon += normal
            cumdailymon += daily
          }
        }
        if (enddate.slice(0, 3) === 'Sep') {
          startdate = 'Sep1';
          enddate = 'Sep30';
          startMonth = startdate.slice(0, 3);
          startDay = parseInt(startdate.slice(3));
          endDay = parseInt(enddate.slice(3));
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            let normal: number
            let daily: number
            let yesterday: number;
            let yesterdayStr: string;
            let yesterdayStrdaily: string;
            if (currentDateStr === 'Sep1') {
              yesterdayStr = 'Aug31'
              yesterdayStrdaily = '31_Aug'
            }
            else {
              yesterday = day - 1;
              yesterdayStr = `${startMonth}${yesterday.toString()}`;
              yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            }
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
            cumnormalmon += normal
            cumdailymon += daily
          }
        }
        cumdep = ((cumdailymon - cumnormalmon) / cumnormalmon)
        this.processedData.push({ districtID: item.districtid, districtname: item.DISTRICT, statename: item.state_code, subdivisionname: item.subdivision_code, dailyrainfall: item[this.currentDateDaily], normalrainfall: normal1, Rainfall: (((item[this.currentDateDaily] - normal1) / normal1) * 100), cummnormal: cumnormalmon, cummdaily: cumdailymon, cumdeparture: cumdep }) * 100;
      }

      else {
        let cumnormalpostmon = 0;
        let cumdailypostmon = 0;
        let startdate = 'Oct1';
        const today = new Date();
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const dd = String(today.getDate());
        const currmonth = months[today.getMonth()];
        let enddate = `${currmonth}${dd}`
        let startMonth = startdate.slice(0, 3);
        let startDay = parseInt(startdate.slice(3));
        let endDay = parseInt(enddate.slice(3));
        for (let day = startDay; day <= endDay; day++) {
          const currentDateStr = `${startMonth}${day.toString()}`;
          const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
          //const currentDateStrdaily = `${day.toString()}_${startMonth}`;
          let normal: number
          let daily: number
          if (currentDateStr === 'Oct1') {
            normal = item[currentDateStr]
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
          }
          else {
            const yesterday = day - 1;
            const yesterdayStr = `${startMonth}${yesterday.toString()}`;
            const yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
          }
          if (normal1 === 0) {
            normal1 = 1
          }
          cumnormalpostmon += normal
          cumdailypostmon += daily
        }
        if (enddate.slice(0, 3) === 'Nov' || enddate.slice(0, 3) === 'Dec') {
          startdate = 'Nov1';
          enddate = 'Nov30';
          startMonth = startdate.slice(0, 3);
          startDay = parseInt(startdate.slice(3));
          endDay = parseInt(enddate.slice(3));
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            //const currentDateStrdaily = `${day.toString()}_${startMonth}`;
            let normal: number
            let daily: number
            let yesterday: number;
            let yesterdayStr: string;
            let yesterdayStrdaily: string;
            if (currentDateStr === 'Nov1') {
              yesterdayStr = 'Oct31'
              yesterdayStrdaily = '31_Oct'
            }
            else {
              yesterday = day - 1;
              yesterdayStr = `${startMonth}${yesterday.toString()}`;
              yesterdayStrdaily = `${yesterday.toString()}_${startMonth}`;
            }
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
            cumnormalpostmon += normal
            cumdailypostmon += daily
          }
        }
        if (enddate.slice(0, 3) === 'Dec') {
          startdate = 'Dec1';
          enddate = 'Dec31';
          startMonth = startdate.slice(0, 3);
          startDay = parseInt(startdate.slice(3));
          endDay = parseInt(enddate.slice(3));
          for (let day = startDay; day <= endDay; day++) {
            const currentDateStr = `${startMonth}${day.toString()}`;
            const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            let normal: number
            let daily: number
            let yesterday: number;
            let yesterdayStr: string;
            let yesterdayStrdaily: string;
            if (currentDateStr === 'Dec1') {
              yesterdayStr = 'Nov30'
              yesterdayStrdaily = '30_Nov'
            }
            else {
              yesterday = day - 1;
              yesterdayStr = `${startMonth}${yesterday.toString()}`;
              yesterdayStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}`;
            }
            normal = (item[currentDateStr] - item[yesterdayStr])
            daily = item[currentDateStrdaily]
            if (Number.isNaN(normal)) {
              normal = 0;
            }
            if (Number.isNaN(daily)) {
              daily = 0;
            }
            cumnormalpostmon += normal
            cumdailypostmon += daily
          }
        }
        const cumdep = ((cumdailypostmon - cumnormalpostmon) / cumnormalpostmon) * 100
        this.processedData.push({ districtID: item.districtid, districtname: item.DISTRICT, statename: item.state_code, subdivisionname: item.subdivision_code, dailyrainfall: item[this.currentDateDaily], normalrainfall: normal1, Rainfall: (((item[this.currentDateDaily] - normal1) / normal1) * 100), cummnormal: cumnormalpostmon, cummdaily: cumdailypostmon, cumdeparture: cumdep });
      }
    }
  }
  private initMap(): void {
    this.map = L.map('map', {
      center: [26, 76.9629],
      zoom: this.initialZoom
    });
    this.map.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map.setZoom(this.initialZoom + 1);
      } else {
        this.map.setZoom(this.initialZoom);
      }
    });
    this.map1 = L.map('map1', {
      center: [26, 76.9629],
      zoom: this.initialZoom
    });

    this.map1.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map1.setZoom(this.initialZoom + 1);
      } else {
        this.map1.setZoom(this.initialZoom);
      }
    });
    this.map2 = L.map('map2', {
      center: [26, 76.9629],
      zoom: this.initialZoom
    });
    this.map2.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map2.setZoom(this.initialZoom + 1);
      } else {
        this.map2.setZoom(this.initialZoom);
      }
    });
    this.map3 = L.map('map3', {
      center: [26, 76.9629],
      zoom: this.initialZoom
    });
    this.map3.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map3.setZoom(this.initialZoom + 1);
      } else {
        this.map3.setZoom(this.initialZoom);
      }
    });
    this.map4 = L.map('map4', {
      center: [26, 76.9629],
      zoom: this.initialZoom
    });
    this.map4.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map4.setZoom(this.initialZoom + 1);
      } else {
        this.map4.setZoom(this.initialZoom);
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
    const fullscreenControl1 = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },
      content: '<i class="fas fa-expand"></i>'
    });
    this.map1.addControl(fullscreenControl1);
    const fullscreenControl2 = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },
      content: '&#x2922'
    });
    this.map2.addControl(fullscreenControl2);
    const fullscreenControl3 = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },
      content: '&#x2922'
    });
    this.map3.addControl(fullscreenControl3);
    const fullscreenControl4 = new (L.Control as any).Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      },
      content: '&#x2922'
    });
    this.map4.addControl(fullscreenControl4);
  }

  private isFullscreen(): boolean {
    return !!(document.fullscreenElement || document.fullscreenElement ||
      document.fullscreenElement || document.fullscreenElement);
  }
  public months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  public today = new Date();
  public month = this.months[this.today.getMonth()];
  public day = String(this.today.getDate()).padStart(2, '0');
  public sortedDataArray: any[]=[];
public regions:any[]=[];
  public sortedSubDivisions:any[]=[];
  async pushDistrict(item:any, name:string){
    if(item.statename == name){
      this.sortedDataArray.push(item);
    }
  }

  async pushDistrict1(item:any, name:string){
    if(item.subdivisionname == name){
      this.sortedDataArray.push(item);
}
  }

  async pushRegion(item:any, name:string){
    if(item.regionname == name){
      this.regions.push(item);
    }
  }

  async pushSubDivision(item:any, name:string){
    if(item.subdivname == name){
      this.sortedSubDivisions.push(item);
    }
  }

  downloadMapData(): void {
    const data = this.processedData;
    const data1 = this.subdivisionfetchedDatadep;
    const data2 = this.statefetchedDatadep;
    const doc = new jsPDF() as any;
    const columns1 = [' ', ' ', { content: 'Day : ' + this.formatteddate, colSpan: 4 }, { content: 'Period:01-10-2023 To ' + this.formatteddate, colSpan: 4 }]
    const columns = ['S.No', 'MET.SUBDIVISION/UT/STATE/DISTRICT', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.', 'ACTUAL(mm)', 'NORMAL(mm)', '%DEP.', 'CAT.'];
    const rows: any[][] = [];
    let previousstateName: string;
    let previoussubdivName: string;
    let stateIndex = 0;


    let statedailyindist: number;
    let statenormalindist: number;
    let statedepindist: number;
    let statecumdailyindist: number;
    let statecumnormalindist: number;
    let statecumdepindist: number;


    let Subdivdailyindist: number;
    let Subdivnormalindist: number;
    let Subdivdepindist: number;
    let Subdivcumdailyindist: number;
    let Subdivcumnormalindist: number;
    let Subdivcumdepindist: number;

    // Group the data by "subdivisionname"
    const groupedData = data.reduce((acc, current) => {
      const group = acc.find((group:any) => group.subdivisionname === current.subdivisionname);
      if (group) {
        var dist = group.districts.find((i:any) => i.districtname == current.districtname);
        if(!dist){
          group.districts.push(current);
        }
      } else {
        acc.push({ subdivisionname: current.subdivisionname, districts: [current] });
      }
      return acc;
    }, []);

    // Sort each group by "districtname & statename"
    groupedData.forEach((group:any) => {
      group.districts.sort((a:any, b:any) => a.districtname.localeCompare(b.districtname));
      group.districts.sort((a:any, b:any) => a.statename.localeCompare(b.statename));
    });

    // Flatten the groups back into a single array
    const sortedData = groupedData.flatMap((group:any) => group.districts);

    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "ANDAMAN & NICOBAR (UT)");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "ARUNACHAL PRADESH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "ASSAM");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "MEGHALAYA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "NAGALAND");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "MANIPUR");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "MIZORAM");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "TRIPURA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "SIKKIM");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "WEST BENGAL");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "ORISSA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "JHARKHAND");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "BIHAR");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "UTTAR PRADESH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "UTTARAKHAND");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "HARYANA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "CHANDIGARH (UT)");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "DELHI (UT)");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "PUNJAB");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "HIMACHAL PRADESH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "JAMMU & KASHMIR (UT)");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "LADAKH (UT)");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "RAJASTHAN");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "MADHYA PRADESH");
    })
    sortedData.forEach(async (item:any) => {
      if(item.subdivisionname !== "SAURASHTRA & KUTCH"){
        await this.pushDistrict(item, "GUJARAT");
      }
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "DADRA & NAGAR HAVELI AND DAMAN & DIU (UT)");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict1(item, "SAURASHTRA & KUTCH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "GOA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "MAHARASHTRA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "CHHATTISGARH");
    })
    sortedData.forEach(async (item:any) => {
      if(item.subdivisionname !== "TN PUDU and KARAIKAL"){
        await this.pushDistrict(item, "PUDUCHERRY (UT)");
      }
    })
    sortedData.forEach(async (item:any) => {
      if(item.subdivisionname !== "RAYALASEEMA"){
        await this.pushDistrict(item, "ANDHRA PRADESH");
      }
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "TELANGANA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict1(item, "RAYALASEEMA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "TAMIL NADU");
    })
    sortedData.forEach(async (item:any) => {
      if(item.subdivisionname == "TN PUDU and KARAIKAL"){
      await this.pushDistrict(item, "PUDUCHERRY (UT)");
      }
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "KARNATAKA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "KERALA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushDistrict(item, "LAKSHADWEEP (UT)");
    })

    this.sortedDataArray.forEach((item:any, index:number) => {
      let currentsubdivname = item.subdivisionname;

      if (currentsubdivname !== previoussubdivName) {
        data1.forEach((item2, index) => {
          if (currentsubdivname === item2.subdivname) {
            Subdivdailyindist = item2.dailyrainfall;
            Subdivnormalindist = item2.normalrainfall;
            Subdivdepindist = item2.subdivdeprainfall;
            Subdivcumdailyindist = item2.cummdaily;
            Subdivcumnormalindist = item2.cummnormal;
            Subdivcumdepindist = item2.cumdeparture;
          }
        });
        const SubdivdailyindistFormatted = Subdivdailyindist !== null && Subdivdailyindist !== undefined && !Number.isNaN(Subdivdailyindist) ? Subdivdailyindist.toFixed(1) : 'NA';
        const SubdivnormalindistFormatted = Subdivnormalindist !== null && Subdivnormalindist !== undefined && !Number.isNaN(Subdivnormalindist) ? Subdivnormalindist.toFixed(1) : 'NA';
        const SubdivdepindistFormatted = Math.floor(Subdivdepindist);
        const SubdivcumdailyindistFormatted = Subdivcumdailyindist !== null && Subdivcumdailyindist !== undefined && !Number.isNaN(Subdivcumdailyindist) ? Subdivcumdailyindist.toFixed(1) : 'NA';
        const SubdivcumnormalindistFormatted = Subdivcumnormalindist !== null && Subdivcumnormalindist !== undefined && !Number.isNaN(Subdivcumnormalindist) ? Subdivcumnormalindist.toFixed(1) : 'NA';
        const SubdivcumdepindistFormatted = Math.floor(Subdivcumdepindist);
        stateIndex = 0;
        rows.push([
          {
            content: '',
            styles: { fillColor: '#4bebfb' }, // Background color
          },
          {
            content: 'SUBDIVISION : ' + currentsubdivname,
            styles: { fillColor: '#4bebfb' }, // Background color
          },
          {
            content: SubdivdailyindistFormatted,
            styles: { fillColor: '#4bebfb' }, // Background color
          },
          {
            content: SubdivnormalindistFormatted,
            styles: { fillColor: '#4bebfb' }, // Background color
          },
          {
            content: String(SubdivdepindistFormatted) == "NaN" ? 0 + "%" : SubdivdepindistFormatted + "%",
            styles: { fillColor: '#4bebfb' }, // Background color
          },
          {
            content: this.getCatForRainfall(Subdivdepindist),
            styles: { fillColor: this.getColorForRainfall(Subdivdepindist) },
          },
          {
            content: SubdivcumdailyindistFormatted,
            styles: { fillColor: '#4bebfb' }, // Background color
          },
          {
            content: SubdivcumnormalindistFormatted,
            styles: { fillColor: '#4bebfb' }, // Background color
          },
          {
            content: String(SubdivcumdepindistFormatted) == "NaN" ? 0 + "%" : SubdivcumdepindistFormatted + "%",
            styles: { fillColor: '#4bebfb' }, // Background color
          },
          {
            content: this.getCatForRainfall(Subdivcumdepindist),
            styles: { fillColor: this.getColorForRainfall(Subdivcumdepindist) },
          },
        ])
      }
      let currentstatename = item.statename;
      if (currentstatename !== previousstateName && item.subdivisionname !== item.statename && item.statename !== 'ANDAMAN & NICOBAR (UT)') {
        data2.forEach((item1, index) => {
          if (currentstatename === item1.statename) {
            statedailyindist = item1.dailyrainfall;
            statenormalindist = item1.normalrainfall;
            statedepindist = item1.statedeprainfall;
            statecumdailyindist = item1.cummdaily;
            statecumnormalindist = item1.cummnormal;
            statecumdepindist = item1.cumdeparture;
          }
        });

        const statedailyindistFormatted = statedailyindist !== null && statedailyindist !== undefined && !Number.isNaN(statedailyindist) ? statedailyindist.toFixed(1) : 'NA';
        const statenormalindistFormatted = statenormalindist !== null && statenormalindist !== undefined && !Number.isNaN(statenormalindist) ? statenormalindist.toFixed(1) : 'NA';
        const statedepindistFormatted = Math.floor(statedepindist);
        const statecumdailyindistFormatted = statecumdailyindist !== null && statecumdailyindist !== undefined && !Number.isNaN(statecumdailyindist) ? statecumdailyindist.toFixed(1) : 'NA';
        const statecumnormalindistFormatted = statecumnormalindist !== null && statecumnormalindist !== undefined && !Number.isNaN(statecumnormalindist) ? statecumnormalindist.toFixed(1) : 'NA';
        const statecumdepindistFormatted = Math.floor(statecumdepindist);

        stateIndex = 1;
        rows.push([
          {
            content: '',
            styles: { fillColor: '#dbb5f7' }, // Background color
          },
          {
            content: 'STATE : ' + currentstatename,
            styles: { fillColor: '#dbb5f7' }, // Background color
          },
          {
            content: statedailyindistFormatted,
            styles: { fillColor: '#dbb5f7' }, // Background color
          },
          {
            content: statenormalindistFormatted,
            styles: { fillColor: '#dbb5f7' }, // Background color
          },
          {
            content: String(statedepindistFormatted) == "NaN" ? 0 + "%" : statedepindistFormatted + "%",
            styles: { fillColor: '#dbb5f7' }, // Background color
          },
          {
            content: this.getCatForRainfall(statedepindist),
            styles: { fillColor: this.getColorForRainfall(statedepindist) },
          },
          {
            content: statecumdailyindistFormatted,
            styles: { fillColor: '#dbb5f7' }, // Background color
          },
          {
            content: statecumnormalindistFormatted,
            styles: { fillColor: '#dbb5f7' }, // Background color
          },
          {
            content: String(statecumdepindistFormatted) == "NaN" ? 0 + "%" : statecumdepindistFormatted + "%",
            styles: { fillColor: '#dbb5f7' }, // Background color
          },
          {
            content: this.getCatForRainfall(statecumdepindist),
            styles: { fillColor: this.getColorForRainfall(statecumdepindist) },
          },
        ])

        rows.push([
          stateIndex,
          item.districtname,
          item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' ',
          item.normalrainfall !== null && item.normalrainfall !== undefined && !Number.isNaN(item.normalrainfall) ? item.normalrainfall.toFixed(1) : 'NA',
          (item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' ') == ' ' ? ' ' :  (item.Rainfall !== null && item.Rainfall !== undefined && !Number.isNaN(item.Rainfall) ? Math.round(item.Rainfall) + "%" : 'NA'),
          {
            content: this.getCatForRainfall(item.Rainfall, item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' '),
            styles: { fillColor: this.getColorForRainfall(item.Rainfall, item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' ') }, // Background color
          },
          item.cummdaily !== null && item.cummdaily !== undefined && !Number.isNaN(item.cummdaily) ? item.cummdaily.toFixed(1) : 'NA',
          item.cummnormal !== null && item.cummnormal !== undefined && !Number.isNaN(item.cummnormal) ? item.cummnormal.toFixed(1) : 'NA',
          item.cumdeparture !== null && item.cumdeparture !== undefined && !Number.isNaN(item.cumdeparture) ? Math.round(item.cumdeparture) + "%" : 'NA',
          {
            content: this.getCatForRainfall(item.cumdeparture),
            styles: { fillColor: this.getColorForRainfall(item.cumdeparture) }, // Background color
          },
        ]);
      }
      else {
        stateIndex++;
          rows.push([
          stateIndex, // Serial number
          item.districtname,
          item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' ',
          item.normalrainfall !== null && item.normalrainfall !== undefined && !Number.isNaN(item.normalrainfall) ? item.normalrainfall.toFixed(1) : 'NA',
          (item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' ') == ' ' ? ' ' :  (item.Rainfall !== null && item.Rainfall !== undefined && !Number.isNaN(item.Rainfall) ? Math.round(item.Rainfall) + "%" : 'NA'),
          {
            content: this.getCatForRainfall(item.Rainfall, item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' '),
            styles: { fillColor: this.getColorForRainfall(item.Rainfall, item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' ') }, // Background color
          },
          item.cummdaily !== null && item.cummdaily !== undefined && !Number.isNaN(item.cummdaily) ? item.cummdaily.toFixed(1) : 'NA',
          item.cummnormal !== null && item.cummnormal !== undefined && !Number.isNaN(item.cummnormal) ? item.cummnormal.toFixed(1) : 'NA',
          item.cumdeparture !== null && item.cumdeparture !== undefined && !Number.isNaN(item.cumdeparture) ? Math.round(item.cumdeparture) + "%" : 'NA',
          {
            content: this.getCatForRainfall(item.cumdeparture),
            styles: { fillColor: this.getColorForRainfall(item.cumdeparture) }, // Background color
          },
                  ]);
      }
      previoussubdivName = currentsubdivname;
      previousstateName = currentstatename;
    });
    // rows.unshift(columns,columns1);
    const tableWidth = 180;
    const cellWidth = 36;
    const cellHeight = 8;
    const marginLeft = 10;
    const marginTop = 10;
    const fontSize = 10;

    // Define the table options
    const options: any = {
      startY: marginTop,
      margin: { left: marginLeft },
    };

    // Add an image to the PDF
    const imgData = '/assets/images/IMDlogo_Ipart.png'; // Replace with the actual image path
    doc.addImage(imgData, 'PNG', marginLeft, marginTop, 15, 20); // Adjust image dimensions as needed
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Set font color to black
    const headingText = 'India Meteorological Department\nHydromet Division, New Delhi';
    const headingText1 = 'DISTRICT-WISE RAINFALL DISTRIBUTION';
    doc.text(headingText, marginLeft + 25, marginTop + 8); // Adjust position as needed
    doc.text(headingText1, marginLeft + 50, marginTop + 28);

    doc.autoTable({
      head: [columns1, columns],
      body: rows,
      theme: 'striped',
      startY: marginTop + cellHeight + 25, // Adjust the vertical position below the image and heading
      margin: { left: marginLeft },
      styles: { fontSize: 7 },
      didDrawCell: function (data: { cell: { text: any; x: number; y: number; width: any; height: any; }; }) {
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        doc.setDrawColor(0);
      },
      didParseCell: function(data:any) {
        data.cell.styles.fontStyle = 'bold';
      }
    });


    const columns2 = ['', 'LEGEND', ''];
    const columns3 = ['CATEGORY', '% DEPARTURES OF RAINFALL', 'COLOUR CODE']; // Update with your second table column names

    const rows2 = [
      ['Large Excess\n(LE or L.Excess)', '>= 60%', { content: '', styles: { fillColor: '#0096ff' } }],
      ['Excess (E)', '>= 20% and <= 59%', { content: '', styles: { fillColor: '#32c0f8' } }],
      ['Normal (N)', '>= -19% and <= +19%', { content: '', styles: { fillColor: '#00cd5b' } }],
      ['Deficient (D)', '>= -59% and <= -20%', { content: '', styles: { fillColor: '#ff2700' } }],
      ['Large Deficient\n(LD or L.Deficient)', '>= -99% and <= -60%', { content: '', styles: { fillColor: '#ffff20' } }],
      ['No Rain(NR)', '= -100%', { content: '', styles: { fillColor: '#ffffff' } }],
      ['Not Available', 'ND', { content: '', styles: { fillColor: '#c0c0c0' } }],
      ['Note : ', { content: 'The rainfall values are rounded off up to one place of decimal.', colSpan: 2 }]
    ];

    // Add a header row to the data array for the second table


    // Define the table options for the second table
    const options2: any = {
      startY: doc.autoTable.previous.finalY + 10, // Start below the first table
      margin: { left: marginLeft },
    };

    // Start a new page
    doc.addPage();

    // Add the second table to the PDF document
    doc.autoTable({
      head: [columns2, columns3],
      body: rows2,
      theme: 'striped',
      didDrawCell: function (data: { cell: { text: any; x: number; y: number; width: any; height: any; }; }) {
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        doc.setDrawColor(0);
      },
    });

    const filename = 'Districtdeparture_data.pdf';
    doc.save(filename);
  }

  downloadMapData1(): void {

    const data = this.statefetchedDatadep.sort((a, b) => {
      return a.regionid - b.regionid;
    });
    const data1 = this.regionfetchedDatadep;

    const doc = new jsPDF() as any;
    const columns1 = [' ', ' ', { content: 'Day : ' + this.formatteddate, colSpan: 4 }, { content: 'Period:01-06-2023 To ' + this.formatteddate, colSpan: 4 }]
    const columns = ['S.No', 'MET.SUBDIVISION/UT/STATE/DISTRICT', 'DAILY', 'NORMAL', 'DEPARTURE', 'CAT', 'DAILY', 'NORMAL', 'DEPARTURE', 'CAT'];
    const rows = [];
    let previousregionName: string;
    let regionIndex = 0;


    let regiondailyindist: number;
    let regionnormalindist: number;
    let regiondepindist: number;
    let regioncumdailyindist: number;
    let regioncumnormalindist: number;
    let regioncumdepindist: number;

    data.forEach((item, index) => {
      let currentregionname = item.regionname;
      if (currentregionname != previousregionName) {
        data1.forEach((item1, index) => {
          if (currentregionname === item1.regionname) {
            regiondailyindist = item1.dailyrainfall;
            regionnormalindist = item1.normalrainfall;
            regiondepindist = item1.regiondeprainfall;
            regioncumdailyindist = item1.cummdaily;
            regioncumnormalindist = item1.cummnormal;
            regioncumdepindist = item1.cumdeparture;
          }
        });
        const regiondailyindistFormatted = regiondailyindist !== null && regiondailyindist !== undefined && !Number.isNaN(regiondailyindist) ? regiondailyindist.toFixed(2) : 'NA';
        const regionnormalindistFormatted = regionnormalindist !== null && regionnormalindist !== undefined && !Number.isNaN(regionnormalindist) ? regionnormalindist.toFixed(2) : 'NA';
        const regiondepindistFormatted = regiondepindist !== null && regiondepindist !== undefined && !Number.isNaN(regiondepindist) ? regiondepindist.toFixed(2) : 'NA';
        const regioncumdailyindistFormatted = regioncumdailyindist !== null && regioncumdailyindist !== undefined && !Number.isNaN(regioncumdailyindist) ? regioncumdailyindist.toFixed(2) : 'NA';
        const regioncumnormalindistFormatted = regioncumnormalindist !== null && regioncumnormalindist !== undefined && !Number.isNaN(regioncumnormalindist) ? regioncumnormalindist.toFixed(2) : 'NA';
        const regioncumdepindistFormatted = regioncumdepindist !== null && regioncumdepindist !== undefined && !Number.isNaN(regioncumdepindist) ? regioncumdepindist.toFixed(2) : 'NA';

        regionIndex = 1;
        rows.push([
          {
            content: '',
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: 'REGION : ' + currentregionname,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: regiondailyindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: regionnormalindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: regiondepindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: this.getCatForRainfall(regiondepindist),
            styles: { fillColor: this.getColorForRainfall(regiondepindist) },
          },
          {
            content: regioncumdailyindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: regioncumnormalindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: regioncumdepindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: this.getCatForRainfall(regiondepindist),
            styles: { fillColor: this.getColorForRainfall(regiondepindist) },
          },
        ])

        rows.push([
          regionIndex,
          item.statename,
          item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(2) : 'NA',
          item.normalrainfall !== null && item.normalrainfall !== undefined && !Number.isNaN(item.normalrainfall) ? item.normalrainfall.toFixed(2) : 'NA',
          item.statedeprainfall !== null && item.statedeprainfall !== undefined && !Number.isNaN(item.statedeprainfall) ? item.statedeprainfall.toFixed(2) : 'NA',
          {
            content: this.getCatForRainfall(item.statedeprainfall),
            styles: { fillColor: this.getColorForRainfall(item.statedeprainfall) },
          },
          item.cummdaily.toFixed(2),
          item.cummnormal.toFixed(2),
          item.cumdeparture.toFixed(2),
          {
            content: this.getCatForRainfall(item.cumdeparture),
            styles: { fillColor: this.getColorForRainfall(item.cumdeparture) },
          },
        ]);
      }
      else {
        regionIndex++;
        rows.push([
          regionIndex,
          item.statename,
          item.dailyrainfall.toFixed(2),
          item.normalrainfall.toFixed(2),
          item.statedeprainfall.toFixed(2),
          {
            content: this.getCatForRainfall(item.statedeprainfall),
            styles: { fillColor: this.getColorForRainfall(item.statedeprainfall) },
          },
          item.cummdaily.toFixed(2),
          item.cummnormal.toFixed(2),
          item.cumdeparture.toFixed(2),
          {
            content: this.getCatForRainfall(item.cumdeparture),
            styles: { fillColor: this.getColorForRainfall(item.cumdeparture) },
          },
        ]);
      }
      previousregionName = currentregionname;
    });
    rows.unshift(columns);

    const tableWidth = 180;
    const cellWidth = 36;
    const cellHeight = 8;
    const marginLeft = 10;
    const marginTop = 10;
    const fontSize = 10;

    // Define the table options
    const options: any = {
      startY: marginTop,
      margin: { left: marginLeft },
    };

    // Add an image to the PDF
    const imgData = '/assets/images/IMDlogo_Ipart.png'; // Replace with the actual image path
    doc.addImage(imgData, 'PNG', marginLeft, marginTop, 15, 20); // Adjust image dimensions as needed
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Set font color to black
    const headingText = 'India Meteorological Department\nHydromet Division, New Delhi';
    const headingText1 = 'STATE-WISE RAINFALL DISTRIBUTION';
    doc.text(headingText, marginLeft + 25, marginTop + 8); // Adjust position as needed
    doc.text(headingText1, marginLeft + 50, marginTop + 28);

    doc.autoTable({
      head: [columns1, columns],
      body: rows,
      theme: 'striped',
      startY: marginTop + cellHeight + 25, // Adjust the vertical position below the image and heading
      margin: { left: marginLeft },
      styles: { fontSize: 7 },
      didDrawCell: function (data: { cell: { text: any; x: number; y: number; width: any; height: any; }; }) {
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        doc.setDrawColor(0);
      },
      didParseCell: function(data:any) {
        data.cell.styles.fontStyle = 'bold';
      }
    });


    const columns2 = ['', 'LEGEND', ''];
    const columns3 = ['CATEGORY', '% DEPARTURES OF RAINFALL', 'COLOUR CODE']; // Update with your second table column names

    const rows2 = [
      ['Large Excess\n(LE or L.Excess)', '>= 60%', { content: '', styles: { fillColor: '#0096ff' } }],
      ['Excess (E)', '>= 20% and <= 59%', { content: '', styles: { fillColor: '#32c0f8' } }],
      ['Normal (N)', '>= -19% and <= +19%', { content: '', styles: { fillColor: '#00cd5b' } }],
      ['Deficient (D)', '>= -59% and <= -20%', { content: '', styles: { fillColor: '#ff2700' } }],
      ['Large Deficient\n(LD or L.Deficient)', '>= -99% and <= -60%', { content: '', styles: { fillColor: '#ffff20' } }],
      ['No Rain(NR)', '= -100%', { content: '', styles: { fillColor: '#ffffff' } }],
      ['Not Available', 'ND', { content: '', styles: { fillColor: '#c0c0c0' } }],
      ['Note : ', { content: 'The rainfall values are rounded off up to one place of decimal.', colSpan: 2 }]
    ];

    // Add a header row to the data array for the second table


    // Define the table options for the second table
    const options2: any = {
      startY: doc.autoTable.previous.finalY + 10, // Start below the first table
      margin: { left: marginLeft },
    };

    // Start a new page
    doc.addPage();

    // Add the second table to the PDF document
    doc.autoTable({
      head: [columns2, columns3],
      body: rows2,
      theme: 'striped',
      didDrawCell: function (data: { cell: { text: any; x: number; y: number; width: any; height: any; }; }) {
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        doc.setDrawColor(0);
      },
    });
    const filename = 'Statedeparture_data.pdf';
    doc.save(filename);
  }

  downloadMapData2(): void {
const groupedData = this.subdivisionfetchedDatadep.reduce((acc, current) => {
      const group = acc.find((group:any) => group.regionname === current.regionname);
      if (group) {
        var dist = group.subDivisions.find((i:any) => i.subdivname == current.subdivname);
        if(!dist){
          group.subDivisions.push(current);
        }
      } else {
        acc.push({ regionname: current.regionname, subDivisions: [current] });
      }
      return acc;
    }, []);

    groupedData.forEach(async (item:any) => {
      await this.pushRegion(item, "EAST & NORTH EAST INDIA");
    })
    groupedData.forEach(async (item:any) => {
      await this.pushRegion(item, "NORTH WEST INDIA");
    })
    groupedData.forEach(async (item:any) => {
      await this.pushRegion(item, "CENTRAL INDIA");
    })
    groupedData.forEach(async (item:any) => {
      await this.pushRegion(item, "SOUTH PENINSULA");
    })
    const sortedData = this.regions.flatMap((group:any) => group.subDivisions);
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "ARUNACHAL PRADESH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "ASSAM & MEGHALAYA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "N M M T");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "SHWB & SIKKIM");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "GANGETIC WEST BENGAL");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "JHARKHAND");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "BIHAR");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "EAST UTTAR PRADESH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "WEST UTTAR PRADESH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "UTTARAKHAND");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "HAR. CHD & DELHI");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "PUNJAB");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "HIMACHAL PRADESH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "JK AND LADAKH (UT)");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "WEST RAJASTHAN");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "EAST RAJASTHAN");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "ORISSA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "WEST MADHYA PRADESH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "EAST MADHYA PRADESH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "GUJARAT REGION");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "SAURASHTRA & KUTCH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "KONKAN & GOA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "MADHYA MAHARASHTRA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "MARATHWADA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "VIDARBHA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "CHHATTISGARH");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "A & N ISLAND");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "COASTAL A.P. & YANAM");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "TELANGANA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "RAYALASEEMA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "TN PUDU and KARAIKAL");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "COASTAL KARNATAKA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "N. I. KARNATAKA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "S. I. KARNATAKA");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "KERALA & MAHE");
    })
    sortedData.forEach(async (item:any) => {
      await this.pushSubDivision(item, "LAKSHADWEEP");
    })

    const data1 = this.regionfetchedDatadep;
    const doc = new jsPDF() as any;

    const columns1 = [' ', ' ', { content: 'Day : ' + this.formatteddate, colSpan: 4 }, { content: 'Period:01-06-2023 To ' + this.formatteddate, colSpan: 4 }]
    const columns = ['S.No', 'MET.SUBDIVISION/UT/STATE/DISTRICT', 'DAILY', 'NORMAL', 'DEPARTURE', 'CAT', 'DAILY', 'NORMAL', 'DEPARTURE', 'CAT'];
    const rows = [];
    let previousregionName: string;
    let regionIndex = 0;

    let regiondailyindist: number;
    let regionnormalindist: number;
    let regiondepindist: number;
    let regioncumdailyindist: number;
    let regioncumnormalindist: number;
    let regioncumdepindist: number;

    this.sortedSubDivisions.forEach((item:any, index:number) => {
      let currentregionname = item.regionname;
      if (currentregionname != previousregionName) {
        data1.forEach((item1, index) => {
          if (currentregionname === item1.regionname) {
            regiondailyindist = item1.dailyrainfall;
            regionnormalindist = item1.normalrainfall;
            regiondepindist = item1.regiondeprainfall;
            regioncumdailyindist = item1.cummdaily;
            regioncumnormalindist = item1.cummnormal;
            regioncumdepindist = item1.cumdeparture;
          }
        });
        const regiondailyindistFormatted = regiondailyindist.toFixed(2);
        const regionnormalindistFormatted = regionnormalindist.toFixed(2);
        const regiondepindistFormatted = regiondepindist.toFixed(2);
        const regioncumdailyindistFormatted = regioncumdailyindist.toFixed(2);
        const regioncumnormalindistFormatted = regioncumnormalindist.toFixed(2);
        const regioncumdepindistFormatted = regioncumdepindist.toFixed(2);

        regionIndex = 1;
        rows.push([
          {
            content: '',
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: 'REGION : ' + currentregionname,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: regiondailyindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: regionnormalindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: regiondepindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: this.getCatForRainfall(regiondepindist),
            styles: { fillColor: this.getColorForRainfall(regiondepindist) },
          },
          {
            content: regioncumdailyindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: regioncumnormalindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: regioncumdepindistFormatted,
            styles: { fillColor: '#dbb5f7' },
          },
          {
            content: this.getCatForRainfall(regiondepindist),
            styles: { fillColor: this.getColorForRainfall(regiondepindist) },
          },
        ])

        rows.push([
          regionIndex,
          item.subdivname,
          item.dailyrainfall.toFixed(2),
          item.normalrainfall.toFixed(2),
          item.subdivdeprainfall.toFixed(2),
          {
            content: this.getCatForRainfall(item.subdivdeprainfall),
            styles: { fillColor: this.getColorForRainfall(item.subdivdeprainfall) },
          },
          item.cummdaily.toFixed(2),
          item.cummnormal.toFixed(2),
          item.cumdeparture.toFixed(2),
          {
            content: this.getCatForRainfall(item.cumdeparture),
            styles: { fillColor: this.getColorForRainfall(item.cumdeparture) },
          },
        ]);
      }
      else {
        regionIndex++;
        rows.push([
          regionIndex,
          item.subdivname,
          item.dailyrainfall.toFixed(2),
          item.normalrainfall.toFixed(2),
          item.subdivdeprainfall.toFixed(2),
          {
            content: this.getCatForRainfall(item.subdivdeprainfall),
            styles: { fillColor: this.getColorForRainfall(item.subdivdeprainfall) },
          },
          item.cummdaily.toFixed(2),
          item.cummnormal.toFixed(2),
          item.cumdeparture.toFixed(2),
          {
            content: this.getCatForRainfall(item.cumdeparture),
            styles: { fillColor: this.getColorForRainfall(item.cumdeparture) },
          },
        ]);
      }
      previousregionName = currentregionname;
    });
    rows.unshift(columns);
    const tableWidth = 180;
    const cellWidth = 36;
    const cellHeight = 8;
    const marginLeft = 10;
    const marginTop = 10;
    const fontSize = 10;

    const options: any = {
      startY: marginTop,
      margin: { left: marginLeft },
    };

    const imgData = '/assets/images/IMDlogo_Ipart.png';
    doc.addImage(imgData, 'PNG', marginLeft, marginTop, 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Set font color to black
    const headingText = 'India Meteorological Department\nHydromet Division, New Delhi';
    const headingText1 = 'SUBDIVISION-WISE RAINFALL DISTRIBUTION';
    doc.text(headingText, marginLeft + 25, marginTop + 8); // Adjust position as needed
    doc.text(headingText1, marginLeft + 50, marginTop + 28);

    doc.autoTable({
      head: [columns1, columns],
      body: rows,
      theme: 'striped',
      startY: marginTop + cellHeight + 25,
      margin: { left: marginLeft },
      styles: { fontSize: 7 },
    });
    const filename = 'Subdivdeparture_data.pdf';
    doc.save(filename);
  }
  downloadMapData3(): void {
    // Get the data from the map, for example, this.processedData
    const data = this.regionfetchedDatadep;

    // Create a new jsPDF instance
    const doc = new jsPDF() as any;

    const columns1 = [' ', ' ', { content: 'Day : ' + this.formatteddate, colSpan: 4 }, { content: 'Period:01-06-2023 To ' + this.formatteddate, colSpan: 4 }];
    const columns = ['S.No', 'REGION', 'DAILY', 'NORMAL', 'DEPARTURE', 'CAT', 'DAILY', 'NORMAL', 'DEPARTURE', 'CAT'];

    const rows = data.map((item, index) => [
      index + 1, // Serial number
      item.regionname,
      item.dailyrainfall.toFixed(2),
      item.normalrainfall.toFixed(2),
      item.regiondeprainfall.toFixed(2),
      {
        content: this.getCatForRainfall(item.regiondeprainfall),
        styles: { fillColor: this.getColorForRainfall(item.regiondeprainfall) }, // Background color
      },
      item.cummdaily.toFixed(2),
      item.cummnormal.toFixed(2),
      item.cumdeparture.toFixed(2),
      {
        content: this.getCatForRainfall(item.cumdeparture),
        styles: { fillColor: this.getColorForRainfall(item.cumdeparture) }, // Background color
      },
    ]);

    // Add a header row to the data array
    rows.unshift(columns);

    // Set table width and text alignment
    const tableWidth = 180;
    const cellWidth = 36;
    const cellHeight = 8;
    const marginLeft = 10;
    const marginTop = 10;
    const fontSize = 10;

    // Define the table options
    const options: any = {
      startY: marginTop,
      margin: { left: marginLeft },
    };

    // Add an image to the PDF
    const imgData = '/assets/images/IMDlogo_Ipart.png'; // Replace with the actual image path
    doc.addImage(imgData, 'PNG', marginLeft, marginTop, 20, 20); // Adjust image dimensions as needed

    // Add a heading to the PDF document with black font color

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Set font color to black
    const headingText = 'India Meteorological Department\nHydromet Division, New Delhi';
    const headingText1 = 'REGION-WISE RAINFALL DISTRIBUTION';
    doc.text(headingText, marginLeft + 25, marginTop + 8); // Adjust position as needed
    doc.text(headingText1, marginLeft + 50, marginTop + 28);

    // Add the table to the PDF document
    doc.autoTable({
      head: [columns1, columns],
      body: rows,
      theme: 'striped',
      startY: marginTop + cellHeight + 25, // Adjust the vertical position below the image and heading
      margin: { left: marginLeft },
      styles: { fontSize: 7 },
    });

    // Save or download the PDF
    const filename = 'Regiondeparture_data.pdf';
    doc.save(filename);
  }
  downloadMapData4(): void {
    // Get the data from the map, for example, this.processedData
    const data = this.regionfetchedDatadep;

    // Create a new jsPDF instance
    const doc = new jsPDF() as any;

    // Define the table columns
    const columns = ['S.No', 'RegionID', 'Regionname', 'Daily Rainfall', 'Normal Rainfall', 'Departure'];
    // Create a data array for the table
    const rows = data.map((item, index) => [
      index + 1, // Serial number
      item.regiondepid,
      item.regionname,
      item.dailyrainfall.toFixed(2),
      item.normalrainfall.toFixed(2),
      item.regiondeprainfall.toFixed(2),
      {
        content: this.getCatForRainfall(item.regiondeprainfall),
        styles: { fillColor: this.getColorForRainfall(item.regiondeprainfall) }, // Background color
      },
    ]);

    // Add a header row to the data array
    rows.unshift(columns);

    // Set table width and text alignment
    const tableWidth = 180;
    const cellWidth = 36;
    const cellHeight = 8;
    const marginLeft = 10;
    const marginTop = 10;
    const fontSize = 10;

    // Define the table options
    const options: any = {
      startY: marginTop,
      margin: { left: marginLeft },
    };

    // Add an image to the PDF
    const imgData = '/assets/images/IMDlogo_Ipart.png'; // Replace with the actual image path
    doc.addImage(imgData, 'PNG', marginLeft, marginTop, 15, 20); // Adjust image dimensions as needed

    // Add a heading to the PDF document with black font color

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Set font color to black
    const headingText = 'India Meteorological Department\nHydromet Division, New Delhi';
    const headingText1 = 'REGION-WISE RAINFALL DISTRIBUTION';
    doc.text(headingText, marginLeft + 25, marginTop + 8); // Adjust position as needed
    doc.text(headingText1, marginLeft + 50, marginTop + 28);

    // Add the table to the PDF document
    doc.autoTable({
      head: [columns],
      body: rows,
      theme: 'striped',
      startY: marginTop + cellHeight + 25, // Adjust the vertical position below the image and heading
      margin: { left: marginLeft },
    });

    const columns2 = ['CATEGORY', '% DEPARTURES OF RAINFALL', 'COLOUR CODE']; // Update with your second table column names

    const rows2 = [
      ['Large Excess\n(LE or L.Excess)', '>= 60%', { styles: { fillColor: '#0096ff' } }],
      ['Excess (E)', '>= 20% and <= 59%', { styles: { fillColor: '#32c0f8' } }],
      ['Normal (N)', '>= -19% and <= +19%', { styles: { fillColor: '#00cd5b' } }],
      ['Deficient (D)', '>= -59% and <= -20%', { styles: { fillColor: '#ff2700' } }],
      ['Large Deficient\n(LD or L.Deficient)', '>= -99% and <= -60%', { styles: { fillColor: '#ffff20' } }],
      ['No Rain(NR)', '= -100%', { styles: { fillColor: '#c0c0c0' } }],
      ['No Data(*)', 'Not Available', { styles: { fillColor: '#ffffff' } }],
      ['Note : ', { content: 'The rainfall values are rounded off up to one place of decimal.', colSpan: 2 }]
    ];

    // Add a header row to the data array for the second table


    // Define the table options for the second table
    const options2: any = {
      startY: doc.autoTable.previous.finalY + 10, // Start below the first table
      margin: { left: marginLeft },
    };

    // Add the second table to the PDF document
    doc.autoTable({
      head: [columns2],
      body: rows2,
      theme: 'striped',
    });

    const filename = 'countrydeparture_data.pdf';
    doc.save(filename);
  }
  loadGeoJSON(): void {
    this.http.get('assets/geojson/INDIA_DISTRICT.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingData(id2);
          const rainfall = matchedData ? matchedData.Rainfall : -100;
          const actual = matchedData && matchedData.dailyrainfall == null ? ' ' : "notnull";
          const color = this.getColorForRainfall(rainfall, actual);
          return {
            fillColor: color,
            weight: 0.5,
            opacity: 2,
            color: 'black',
            fillOpacity: 2
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const id1 = feature.properties['name'];
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingData(id2);
          const rainfall = matchedData && matchedData.Rainfall !== null && matchedData.Rainfall !== undefined && !Number.isNaN(matchedData.Rainfall) ? matchedData.Rainfall.toFixed(2) : 'NA';
          const dailyrainfall = matchedData && matchedData.dailyrainfall !== null && matchedData.dailyrainfall != undefined && !Number.isNaN(matchedData.dailyrainfall) ? matchedData.dailyrainfall.toFixed(2) : 'NA';
          const normalrainfall = matchedData && !Number.isNaN(matchedData.normalrainfall) ? matchedData.normalrainfall.toFixed(2) : 'NA';
          const popupContent = `
            <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${dailyrainfall}</div>
              <div style="color: #002467; font-weight: bold; font-size: 10px;">NORMAL RAINFALL: ${normalrainfall}</div>
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DEPARTURE: ${rainfall}% </div>
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
    this.http.get('assets/geojson/INDIA_STATE.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingDatastate(id2);
          const rainfall = matchedData ? matchedData.statedeprainfall : 0;
          const color = this.getColorForRainfall(rainfall);
          return {
            fillColor: color,
            weight: 0.5,
            opacity: 2,
            color: 'black',
            fillOpacity: 2
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const id1 = feature.properties['name'];
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingDatastate(id2);
          const rainfall = matchedData ? matchedData.statedeprainfall.toFixed(2) : '0.00';
          const dailyrainfall = matchedData ? matchedData.dailyrainfall.toFixed(2) : '0.00';
          const normalrainfall = matchedData ? matchedData.normalrainfall.toFixed(2) : '0.00';
          const popupContent = `
                <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
                  <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
                  <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${dailyrainfall}</div>
                  <div style="color: #002467; font-weight: bold; font-size: 10px;">NORMAL RAINFALL: ${normalrainfall}</div>
                  <div style="color: #002467; font-weight: bold; font-size: 10px;">DEPARTURE: ${rainfall}% </div>
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
      }).addTo(this.map1);
    });
    this.http.get('assets/geojson/INDIA_SUB_DIVISION.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingDatasubdiv(id2);
          const rainfall = matchedData ? matchedData.subdivdeprainfall : 0;
          const color = this.getColorForRainfall(rainfall);
          return {
            fillColor: color,
            weight: 0.5,
            opacity: 2,
            color: 'black',
            fillOpacity: 2
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const id1 = feature.properties['name'];
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingDatasubdiv(id2);
          const rainfall = matchedData ? matchedData.subdivdeprainfall.toFixed(2) : '0.00';
          const dailyrainfall = matchedData ? matchedData.dailyrainfall.toFixed(2) : '0.00';
          const normalrainfall = matchedData ? matchedData.normalrainfall.toFixed(2) : '0.00';
          const popupContent = `
              <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
                <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
                <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${dailyrainfall}</div>
                <div style="color: #002467; font-weight: bold; font-size: 10px;">NORMAL RAINFALL: ${normalrainfall}</div>
                <div style="color: #002467; font-weight: bold; font-size: 10px;">DEPARTURE: ${rainfall}% </div>
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
      }).addTo(this.map2);
    });
    this.http.get('assets/geojson/INDIA_REGIONS.json').subscribe((res: any) => {
      const geoJsonLayer = L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingDataregion(id2);
          const rainfall = matchedData ? matchedData.regiondeprainfall : 0;
          const color = this.getColorForRainfall(rainfall);
          return {
            fillColor: color,
            weight: 0.5,
            opacity: 2,
            color: 'black',
            fillOpacity: 2
          };
        },

        onEachFeature: (feature: any, layer: any) => {
          const id1 = feature.properties['name'];
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingDataregion(id2);
          const rainfall = matchedData ? matchedData.regiondeprainfall.toFixed(2) : '0.00';
          const dailyrainfall = matchedData ? matchedData.dailyrainfall.toFixed(2) : '0.00';
          const normalrainfall = matchedData ? matchedData.normalrainfall.toFixed(2) : '0.00';

          // Create a custom HTML element for the text
          // Create a custom HTML element for the text
          const textElement = document.createElement('div');
          textElement.innerHTML = `
          <div style="padding: 5px; font-family: Arial, sans-serif; font-weight: bolder;">
          <div style="color: #000000;font-weight: bolder; font-size: 9px;">${dailyrainfall}(${rainfall})</div>
          <div style="color: #000000;font-weight: bolder; font-size: 9px;">${id1}</div>
          <div style="color: #000000;font-weight: bolder; font-size: 9px;">${normalrainfall}</div>
          </div>`;

          // Get the bounds of the layer and calculate its center
          const bounds = layer.getBounds();
          const center = bounds.getCenter();

          // Set the position of the custom HTML element on the map
          textElement.style.position = 'absolute';
          textElement.style.left = `${this.map3.latLngToLayerPoint(center).x - 25}px`;
          textElement.style.top = `${this.map3.latLngToLayerPoint(center).y - 25}px`;

          // Set a higher z-index to ensure the text appears on top of the map
          textElement.style.zIndex = '1000';

          // Append the custom HTML element to the map container
          this.map3.getPanes().overlayPane.appendChild(textElement);

        }

      });

      // Add the geoJsonLayer to the map
      geoJsonLayer.addTo(this.map3);
    });
    this.http.get('assets/geojson/INDIA_COUNTRY.json').subscribe((res: any) => {
      L.geoJSON(res, {
        //this.countryfetcheddata.push({countryid : item['regionid'],countrynormal : normal, countrydaily : this.countrydaily, countrydep : ( this.countrydaily- normal )/normal  });
        style: (feature: any) => {
          const id2 = feature.properties['object_id'];
          const matchedData = this.findMatchingDatacountry(id2);
          const rainfall = matchedData ? matchedData.countrydep : '0.00';
          const color = this.getColorForRainfall(rainfall);
          return {
            fillColor: color,
            weight: 0.5,
            opacity: 2,
            color: 'black',
            fillOpacity: 2
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const id1 = feature.properties['name'];
          const id2 = feature.properties['object_id'];
          const matchedData = this.findMatchingDatacountry(id2);
          const rainfall = matchedData ? matchedData.countrydep : '0.00';
          const dailyrainfall = matchedData ? matchedData.countrydaily.toFixed(2) : '0.00';
          const normalrainfall = matchedData ? matchedData.countrynormal.toFixed(2) : '0.00';
          const popupContent = `
              <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
                <div style="color: #002467; font-weight: bold; font-size: 10px;">${id1}</div>
                <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${dailyrainfall}</div>
                <div style="color: #002467; font-weight: bold; font-size: 10px;">NORMAL RAINFALL: ${normalrainfall}</div>
                <div style="color: #002467; font-weight: bold; font-size: 10px;">DEPARTURE: ${rainfall}% </div>
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
      }).addTo(this.map4);
    });
  }
  getColorForRainfall(rainfall: number, actual?: string): string {
    const numericId = rainfall;
    let cat = '';

    if (numericId > 60) {
      cat = 'LE';
      return '#0096ff';
    }
    if (numericId >= 20 && numericId <= 59) {
      cat = 'E';
      return '#32c0f8';
    }
    if (numericId >= -19 && numericId <= 19) {
      cat = 'N';
      return '#00cd5b';
    }
    if (numericId >= -59 && numericId <= -20) {
      cat = 'D';
      return '#ff2700';
    }
    if (numericId >= -99 && numericId <= -60) {
      cat = 'LD';
      return '#ffff20';
    }
    if(actual == ' '){
      return '#c0c0c0';
    }
    if (numericId == -100) {
      cat = 'NR';
      return '#ffffff';
    }
    else {
      cat = 'ND';
      return '#c0c0c0';
    }
  }
  getCatForRainfall(rainfall: number, actual?:string): string {
    const numericId = rainfall;
    if (numericId > 60) {
      return 'LE';
    }
    if (numericId >= 20 && numericId <= 59) {
      return 'E';
    }
    if (numericId >= -19 && numericId <= 19) {
      return 'N';
    }
    if (numericId >= -59 && numericId <= -20) {
      return 'D';
    }
    if (numericId >= -99 && numericId <= -60) {
      return 'LD';
    }
    if(actual == ' '){
      return 'ND';
    }
    if (numericId == -100) {
      return 'NR';
    }
    else {
      return 'ND';
    }
  }

  filter = (node: HTMLElement) => {
    const exclusionClasses = ['download', 'downloadpdf', 'leaflet-control-zoom', 'leaflet-control-fullscreen', 'leaflet-control-zoomin'];
    return !exclusionClasses.some((classname) => node.classList?.contains(classname));
  }

  downloadMapImage(): void {
    htmlToImage.toJpeg(document.getElementById('map') as HTMLElement, { quality: 0.95, filter: this.filter})
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'District_dep.jpeg';
      link.href = dataUrl;
      link.click();
    });
  }
  downloadMapImage1(): void {
    htmlToImage.toJpeg(document.getElementById('map1') as HTMLElement, { quality: 0.95, filter: this.filter})
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'state_dep.jpeg';
      link.href = dataUrl;
      link.click();
    });
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
  downloadMapImage3(): void {
    htmlToImage.toJpeg(document.getElementById('map3') as HTMLElement, { quality: 0.95, filter: this.filter })
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'region_dep.jpeg';
      link.href = dataUrl;
      link.click();
    });
  }
  downloadMapImage4(): void {
    htmlToImage.toJpeg(document.getElementById('map4') as HTMLElement, { quality: 0.95, filter: this.filter })
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'country_dep.jpeg';
      link.href = dataUrl;
      link.click();
    });

    // html2canvas(document.getElementById('map4') as HTMLElement).then(canvas => {
    //   const link = document.createElement('a');
    //   link.download = 'country_dep.png';
    //   link.href = canvas.toDataURL('image/png');
    //   link.click();
    // });
  }

  getNormalMap(){
    this.router.navigate(['/normal']);
  }

  getDepartureMap(){
    this.router.navigate(['/departure']);
  }
}