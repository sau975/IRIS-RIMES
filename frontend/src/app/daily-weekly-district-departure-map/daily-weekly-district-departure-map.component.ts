import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EMPTY, concatMap, filter } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DataService } from '../data.service';

@Component({
  selector: 'app-daily-weekly-district-departure-map',
  templateUrl: './daily-weekly-district-departure-map.component.html',
  styleUrls: ['./daily-weekly-district-departure-map.component.css']
})
export class DailyWeeklyDistrictDepartureMapComponent implements OnInit, AfterViewInit {

  @Input() previousWeekWeeklyStartDate: string = '';
  @Input() previousWeekWeeklyEndDate: string = '';
  selectedDate: Date = new Date();
  selectedWeek: string = '';
  selectedYear: string = '';
  isDaily: boolean = false;
  private initialZoom = 5;
  private map: L.Map = {} as L.Map;
  currentDateNormal: string = '';
  currentDateDaily: string = '';
  currentDateNormaly: string = '';
  fetchedData: any;
  fetchedData1: any;
  fetchedData2: any;
  fetchedData3: any;
  fetchedData4: any;
  fetchedData5: any;
  fetchedData6: any;
  fetchedData7: any;
  fetchedMasterData: any;
  formatteddate: any;
  dd: any;
  today = new Date();
  months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  weeklyDates:any[]=[];

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    let localDailyDate:any = localStorage.getItem('dailyDate')
    if(localDailyDate){
      this.isDaily = true;
      let dailyDate = JSON.parse(localDailyDate);
      this.today.setDate(dailyDate.date)
      this.today.setMonth(dailyDate.month - 1)
      this.today.setFullYear(dailyDate.year)
    }
    let localWeekDates:any = localStorage.getItem('weekDates')
    if(localWeekDates){
      this.isDaily = false;
      let weeklyDates = JSON.parse(localWeekDates);
      this.previousWeekWeeklyStartDate = weeklyDates.previousWeekWeeklyStartDate;
      this.previousWeekWeeklyEndDate = weeklyDates.previousWeekWeeklyEndDate;
    }
    this.dateCalculation();
  }
  ngAfterViewInit(): void {
    this.initMap();
  }
  ngOnInit(): void {
    this.weeklyDatesCalculation();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      location.reload();
    });
    this.fetchDataFromBackend();
  }

  weeklyDatesCalculation(){
    if(this.previousWeekWeeklyStartDate && this.previousWeekWeeklyEndDate){
      var startDate = new Date(this.previousWeekWeeklyStartDate);
      var endDate = new Date(this.previousWeekWeeklyEndDate);
      var currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        var dd = String(currentDate.getDate());
        const currmonth = this.months[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        const selectedYear = String(year).slice(-2);
        this.weeklyDates.push(`${dd.padStart(2, '0')}_${currmonth}_${selectedYear}`);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }

  dailyDeparture(){
    this.today = new Date(this.selectedDate);
    this.dateCalculation()
    this.fetchDataFromBackend();
  }
  weeklyDeparture(){
    var splitedDate = this.selectedWeek.split('&');
    this.previousWeekWeeklyStartDate = this.selectedYear + splitedDate[0];
    this.previousWeekWeeklyEndDate = this.selectedYear + splitedDate[1];
    this.weeklyDatesCalculation();
    this.fetchDataFromBackend();
  }

  dateCalculation() {
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
    const currmonth = this.months[this.today.getMonth()];
    const enddate = `${currmonth}${this.dd}`
    const ddy = String(yesterday.getDate());
    const currmonthy = this.months[yesterday.getMonth()];

    this.currentDateNormal = `${currmonth}${this.dd}`;
    this.currentDateNormaly = `${currmonthy}${ddy}`;
    const selectedYear = String(year).slice(-2);
    this.currentDateDaily = `${this.dd.padStart(2, '0')}_${currmonth}_${selectedYear}`;
    this.weeklyDates.push(this.currentDateDaily);
    console.log(this.currentDateDaily, "dateeeeee")
  }
  fetchDataFromBackend(): void {
    this.dataService.fetchMasterFile().pipe(
      concatMap(masterData => {
        this.fetchedMasterData = masterData;
        this.stationtodistrict();
        return this.dataService.fetchData();
      }),
      concatMap(fetchedData => {
        this.fetchedData = fetchedData;
        this.processFetchedData();
        this.processFetchedDatastatedaily();
        this.processFetchedDatasubdivdaily();
        this.processFetchedDataregiondaily();
        this.processFetchedDatacountrydaily();
        return this.dataService.fetchData4();
      }),
      concatMap(fetchedData4 => {
        this.fetchedData4 = fetchedData4;
        this.processFetchedDatastatenormal();
        return this.dataService.fetchData5();
      }),
      concatMap(fetchedData5 => {
        this.fetchedData5 = fetchedData5;
        this.processFetchedDatasubdivnormal();
        return this.dataService.fetchData6();
      }),
      concatMap(fetchedData6 => {
        this.fetchedData6 = fetchedData6;
        this.processFetchedDataregionnormal();
        return this.dataService.fetchData7(); // or any observable to complete the chain
      }),
      concatMap(fetchedData7 => {
        this.fetchedData7 = fetchedData7;
        this.processFetchedDatacountrynormal();
        this.loadGeoJSON();
        return EMPTY; // or any observable to complete the chain
      })
    ).subscribe(
      () => { },
      error => console.error('Error fetching data:', error)
    );
  }
  findMatchingData(id: string): any | null {
    const matchedData = this.districtdatacum.find((data: any) => data.districtID == id);
    if (matchedData) {
      return matchedData;
    }
    else {
      return null;
    }
  }
  findMatchingDatastate(id: string): any | null {
    const matchedData = this.statefetchedDatadepcum.find((data: any) => data.statedepid == id);
    return matchedData || null;
  }
  findMatchingDatasubdiv(id: string): any | null {
    const matchedData = this.subdivisionfetchedDatadepcum.find((data: any) => data.subdivid == id);
    return matchedData || null;
  }
  findMatchingDataregion(id: string): any | null {
    const matchedData = this.regionfetchedDatadepcum.find((data: any) => data.regionid === id);
    return matchedData || null;
  }
  findMatchingDatacountry(id: string): any | null {
    const matchedData = this.countryfetchedDatadepcum.find((data: any) => data.countryid === id);
    return matchedData || null;
  }

  stationtodistrictdata: any[] = [];
  districtnormals: any[] = [];
  districtdatacum: any[] = [];
  statefetchedDatadaily: any[] = [];
  statefetchedDatanormal: any[] = [];
  statefetchedDatadepcum: any[] = [];
  subdivisionfetchedDatadaily: any[] = [];
  subdivisionfetchedDatanormal: any[] = [];
  subdivisionfetchedDatadepcum: any[] = [];
  regionfetchedDatadaily: any[] = [];
  regionfetchedDatanormal: any[] = [];
  regionfetchedDatadepcum: any[] = [];
  countryfetchedDatadaily: any[] = [];
  countryfetchedDatanormal: any[] = [];
  countryfetchedDatadepcum: any[] = [];
  public countrydaily = 0

  stationtodistrict() {
    this.stationtodistrictdata = [];
    let previousdistrictid:any = null;
    let previousdistrictname = "";
    let districtarea:any = null;
    let stationrainfallsum = 0;
    let numberofstations = 0;
    let previousstateid:any = null;
    let previousstatename = "";
    let previoussubdivid:any = null;
    let previoussubdivname = "";
    let subdivweights:any = null;
    let previousregionid:any = null;
    let previousregionname = "";
    let districtcumdata = 0;
    let prevsubdivorder = 0;
    let prevstateorder = 0;
    let prevregionorder = 0;
    this.weeklyDates.forEach(wd => {
    for (const item of this.fetchedMasterData) {
      if (item.district_code == previousdistrictid || previousdistrictid == null) {
        if (item[wd] != -999.9) {
          stationrainfallsum = stationrainfallsum + item[wd];
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
          stateorder : prevstateorder,
          subdivid: previoussubdivid,
          subdivname: previoussubdivname,
          subdivorder : prevsubdivorder,
          regionid: previousregionid,
          regionname: previousregionname,
          regionorder : prevregionorder,
          stationrainfallsumcum: districtcumdata,
          dailyrainfallcum: districtcumdata / numberofstations,
        });
        if (item[wd] != -999.9) {
          stationrainfallsum = item[wd];
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
      prevsubdivorder = item.subdivorder;
      prevregionorder = item.regionorder;
      prevstateorder = item.stateorder;
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
      stateorder : prevstateorder,
      subdivid: previoussubdivid,
      subdivname: previoussubdivname,
      subdivorder : prevsubdivorder,
      regionid: previousregionid,
      regionname: previousregionname,
      regionorder : prevregionorder,
      stationrainfallsumcum: districtcumdata,
      dailyrainfallcum: districtcumdata / numberofstations,
    });
  })

    // Calculate total daily rainfall for each district
    const result = this.stationtodistrictdata.reduce((acc, current) => {
      const { districtid, dailyrainfall } = current;

      // If the districtid is already in the accumulator, add the dailyrainfall to the existing total
      if (acc[districtid]) {
        acc[districtid] += dailyrainfall;
      } else {
        // If the districtid is not in the accumulator, create a new entry
        acc[districtid] = dailyrainfall;
      }

      return acc;
    }, {});

    this.stationtodistrictdata.forEach((obj: any) => {
      if (result.hasOwnProperty(obj.districtid)) {
        obj.dailyrainfall = result[obj.districtid];
      }
    });
  }

  dailyRainFallCumulative() {
    const districtSumCount: any = {};
    this.fetchedMasterData.forEach((entry: any) => {
      const districtId = entry.district_code;
      const octValues = this.date();
      if (!districtSumCount[districtId]) {
        districtSumCount[districtId] = {};
        octValues.forEach(oct => districtSumCount[districtId][oct] = { sum: 0, count: 0 });
      }
      octValues.forEach(oct => {
        if (entry[oct] != undefined) {
          districtSumCount[districtId][oct].sum += entry[oct] == -999.9 ? 0 : entry[oct];
          entry[oct] == -999.9 ? districtSumCount[districtId][oct].count + 0 : districtSumCount[districtId][oct].count++;
        }
      });
    });

    // Calculate the average for each districtId and each Oct value
    const districtAverage: any = {};
    for (const districtId in districtSumCount) {
      districtAverage[districtId] = {};
      const octValues = this.date();
      octValues.forEach(oct => {
        districtAverage[districtId][oct] = districtSumCount[districtId][oct].sum == 0 ? 0 : districtSumCount[districtId][oct].sum / districtSumCount[districtId][oct].count;
      });
    }

    // Convert the result object into an array
    const resultArray = Object.entries(districtAverage).map(([districtId, averages]) => ({
      districtId,
      ...averages as {}
    }));
    // Calculate the total sum for each districtId and add the total value to the array
    const totalByDistrict: any = {};
    resultArray.forEach((entry: any) => {
      const districtId = entry.districtId;
      const octValues = this.date();

      if (!totalByDistrict[districtId]) {
        totalByDistrict[districtId] = { total: 0 };
      }

      octValues.forEach(oct => {
        totalByDistrict[districtId][oct] = (totalByDistrict[districtId][oct] || 0) + entry[oct];
        totalByDistrict[districtId].total += entry[oct];
      });
    });

    resultArray.forEach((entry: any) => {
      const districtId = entry.districtId;
      const totalValue = totalByDistrict[districtId].total;
      entry.total = totalValue;
    });
    return resultArray;
  }

  date() {
    let currentEndDay = this.previousWeekWeeklyEndDate ? new Date(this.previousWeekWeeklyEndDate).getDate() : this.today.getDate();
    let startMonth = this.previousWeekWeeklyEndDate ? this.months[new Date(this.previousWeekWeeklyEndDate).getMonth()] : this.months[this.today.getMonth()];
    let startDay = 1;
    let endDay = currentEndDay.toString().length == 1 ? 0 + currentEndDay : currentEndDay;
    let allDates = [];
    for (let day = startDay; day <= endDay; day++) {
      const year = this.today.getFullYear();
      const selectedYear = String(year).slice(-2);
      const currentDateStrdaily = `${day.toString().padStart(2, '0')}_${startMonth}_${selectedYear}`;
      allDates.push(currentDateStrdaily);
    }
    return allDates;
  }

  processFetchedData(): void {
    this.districtnormals = [];
    let districtcumnormal = 0;
    for (const item of this.fetchedData) {
      let normal1: number
      if (this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' || this.currentDateNormal === 'Jun1' || this.currentDateNormal === 'Oct1') {
        normal1 = item[this.currentDateNormal]
        if (normal1 == 0) {
          normal1 = 0.01
        }
      }
      else {
        normal1 = (item[this.currentDateNormal] - item[this.currentDateNormaly])
        if (normal1 == 0) {
          normal1 = 0.01
        }
      }
      districtcumnormal = item[this.currentDateNormal]
      this.districtnormals.push({
        districtID: item.district_code,
        normalrainfall: normal1,
        cummnormal: districtcumnormal
      });
    }
    this.mergedistrictdailyandnormal();
  }
  mergedistrictdailyandnormal(): void {
    this.districtdatacum = [];
    this.districtnormals.forEach((item1) => {
      const matchingItem = this.stationtodistrictdata.find((item2) => item1.districtID == item2.districtid);
      let matcheddailyrainfall = 0;
      let matcheddailyrainfallcum = 0;
      if (matchingItem) {
        if (matchingItem.dailyrainfall !== undefined && !Number.isNaN(matchingItem.dailyrainfall)) {
          matcheddailyrainfall = matchingItem.dailyrainfall;
        }
        if (matchingItem.dailyrainfallcum !== undefined && !Number.isNaN(matchingItem.dailyrainfallcum)) {
          matcheddailyrainfallcum = matchingItem.dailyrainfallcum;
        }
      }

      const dailydeparturerainfall = ((matcheddailyrainfall - item1.normalrainfall) / item1.normalrainfall) * 100;
           if(item1.normalrainfall == 0.01){
        //console.log(item1.normalrainfall, matchingItem.districtname,dailydeparturerainfall)
      }
      const cumdeparture = ((matcheddailyrainfallcum - item1.cummnormal) / item1.cummnormal) * 100
      if (matchingItem) {
        this.districtdatacum.push({ ...item1, ...matchingItem, dailydeparturerainfall, cumdeparture });
      } else {
        // console.log("data not found")
      }
    });

    var dailyRainFallCumulativeArray = this.dailyRainFallCumulative();
    var array2Map = dailyRainFallCumulativeArray.reduce((acc: any, obj: any) => {
      acc[obj.districtId] = obj.total;
      return acc;
    }, {});

    this.districtdatacum.forEach((obj: any) => {
      if (array2Map.hasOwnProperty(obj.districtid)) {
        let decimalPlaces = 1;
        let roundedNumber = Math.round(array2Map[obj.districtid] * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);

        obj.dailyrainfallcum = roundedNumber;
        obj.cumdeparture = (Number(roundedNumber.toFixed(1)) - obj.cummnormal) / obj.cummnormal * 100;
      }
    });
  }

  processFetchedDatastatedaily(): void {
    this.statefetchedDatadaily = [];
    this.districtdatacum.sort((a, b) => {
      return a.stateorder - b.stateorder;
    });
    let product = 0;
    let cumproduct = 0;
    let sum = 0;
    let previousStateId = null;
    let previousStatename = null;
    let previousregionid = null;
    let previousregionname = null;
    let previousregionorder = 0;

    for (const item of this.districtdatacum) {
      if (previousStateId == item['stateid'] || previousStateId === null) {
        if (Number.isNaN(item.dailyrainfall)) {
          cumproduct += 0;
          product += 0;
          sum += 0
        }
        else {
          cumproduct += item['districtarea'] * item.dailyrainfallcum;
          product += item['districtarea'] * item.dailyrainfall;
          sum += item['districtarea'];
        }
      }
      else {
        this.statefetchedDatadaily.push({
          statedailyid: previousStateId,
          statename: previousStatename,
          dailyrainfallcum: cumproduct / sum,
          dailyrainfall: product / sum,
          RegionId: previousregionid,
          RegionName: previousregionname,
          regionorder : previousregionorder,
        });
        cumproduct = item['districtarea'] * item.dailyrainfallcum;
        product = item['districtarea'] * item.dailyrainfall;
        sum = item['districtarea'];
      }
      cumproduct;
      product;
      sum;
      previousStateId = item['stateid'];
      previousStatename = item.statename;
      previousregionid = item.regionid;
      previousregionname = item.regionname;
      previousregionorder = item.regionorder;
    }
    this.statefetchedDatadaily.push({
      statedailyid: previousStateId,
      statename: previousStatename,
      dailyrainfallcum: cumproduct / sum,
      dailyrainfall: product / sum,
      RegionId: previousregionid,
      RegionName: previousregionname,
      regionorder : previousregionorder,
    });
  }
  processFetchedDatastatenormal(): void {
    this.statefetchedDatanormal = [];
    let statecumnormal = 0;
    for (const item of this.fetchedData4) {
      let normal1: number
      if (this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' || this.currentDateNormal === 'Jun1' || this.currentDateNormal === 'Oct1') {
        normal1 = item[this.currentDateNormal]
      }
      else {
        normal1 = (item[this.currentDateNormal] - item[this.currentDateNormaly])
        if (normal1 === 0) {
          normal1 = 0.01
        }
      }
      statecumnormal = item[this.currentDateNormal]
      this.statefetchedDatanormal.push({
        statedepid: item['state_code'],
        normalrainfall: normal1,
        cummnormal: statecumnormal
      });
    }
    this.mergestatedailyandnormal();
  }
  mergestatedailyandnormal(): void {
    this.statefetchedDatadepcum = []
    this.statefetchedDatanormal.forEach((item1) => {
      const matchingItem = this.statefetchedDatadaily.find((item2) => item1.statedepid == item2.statedailyid);
      let matcheddailyrainfall = 0;
      let matcheddailyrainfallcum = 0;
      if (matchingItem) {
        if (matchingItem.dailyrainfall !== undefined && !Number.isNaN(matchingItem.dailyrainfall)) {
          matcheddailyrainfall = matchingItem.dailyrainfall;
        }
        if (matchingItem.dailyrainfallcum !== undefined && !Number.isNaN(matchingItem.dailyrainfallcum)) {
          matcheddailyrainfallcum = matchingItem.dailyrainfallcum;
        }
      }
      const dailydeparturerainfall = ((matcheddailyrainfall - item1.normalrainfall) / item1.normalrainfall) * 100;
      const cumdeparture = ((matcheddailyrainfallcum - item1.cummnormal) / item1.cummnormal) * 100
      if (matchingItem) {
        this.statefetchedDatadepcum.push({ ...item1, ...matchingItem, dailydeparturerainfall, cumdeparture });
      } else {
        // console.log("data not found")
      }
    });
    // console.log(this.statefetchedDatadepcum)
  }

  processFetchedDatasubdivdaily(): void {
    this.subdivisionfetchedDatadaily = []
    this.districtdatacum.sort((a, b) => {
      return a.subdivid - b.subdivid;
    });
    let product = 0;
    let sum = 0;
    let cumproduct = 0;
    let previoussubdivname = null;
    let previoussubdivid = null;
    let previousregionid = null;
    let previousregionname = null;
    let previousregionorder = 0;

    for (const item of this.districtdatacum) {
      if (previoussubdivid === item['subdivid'] || previoussubdivid === null) {
        if (Number.isNaN(item.dailyrainfall)) {
          cumproduct += 0;
          product += 0;
          sum += 0
        }
        else {
          cumproduct += item['districtarea'] * item.dailyrainfallcum;
          product += item['districtarea'] * item.dailyrainfall;
          sum += item['districtarea'];
        }
      }
      else {
        this.subdivisionfetchedDatadaily.push({
          subdivdailyid: previoussubdivid,
          subdivname: previoussubdivname,
          dailyrainfall: product / sum,
          dailyrainfallcum: cumproduct / sum,
          RegionId: previousregionid,
          RegionName: previousregionname,
          regionorder : previousregionorder,
        });
        cumproduct = item['districtarea'] * item.dailyrainfallcum;
        product = item['districtarea'] * item.dailyrainfall;
        sum = item['districtarea'];
      }
      cumproduct;
      product;
      sum;
      previoussubdivid = item['subdivid'];
      previoussubdivname = item.subdivname;
      previousregionid = item.regionid;
      previousregionname = item.regionname;
      previousregionorder = item.regionorder;
    }
    this.subdivisionfetchedDatadaily.push({
      subdivdailyid: previoussubdivid,
      subdivname: previoussubdivname,
      dailyrainfall: product / sum,
      dailyrainfallcum: cumproduct / sum,
      RegionId: previousregionid,
      RegionName: previousregionname,
      regionorder : previousregionorder,
    });
  }

  processFetchedDatasubdivnormal(): void {
    this.subdivisionfetchedDatanormal = [];
    let subdivcumnormal = 0;
    for (const item of this.fetchedData5) {
      let normal1: number
      if (this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' || this.currentDateNormal === 'Jun1' || this.currentDateNormal === 'Oct1') {
        normal1 = item[this.currentDateNormal]
      }
      else {
        normal1 = (item[this.currentDateNormal] - item[this.currentDateNormaly])
        if (normal1 === 0) {
          normal1 = 0.01
        }
      }
      subdivcumnormal = item[this.currentDateNormal]
      this.subdivisionfetchedDatanormal.push({
        subdivid: item['subdivid'],
        normalrainfall: normal1,
        cummnormal: subdivcumnormal
      });
    }
    this.mergesubdivdailyandnormal();

  }
  mergesubdivdailyandnormal(): void {
    this.subdivisionfetchedDatadepcum = []
    this.subdivisionfetchedDatanormal.forEach((item1) => {
      const matchingItem = this.subdivisionfetchedDatadaily.find((item2) => item1.subdivid == item2.subdivdailyid);
      let matcheddailyrainfall = 0;
      let matcheddailyrainfallcum = 0;
      if (matchingItem) {
        if (matchingItem.dailyrainfall !== undefined && !Number.isNaN(matchingItem.dailyrainfall)) {
          matcheddailyrainfall = matchingItem.dailyrainfall;
        }
        if (matchingItem.dailyrainfallcum !== undefined && !Number.isNaN(matchingItem.dailyrainfallcum)) {
          matcheddailyrainfallcum = matchingItem.dailyrainfallcum;
        }

      }
      const dailydeparturerainfall = ((matcheddailyrainfall - item1.normalrainfall) / item1.normalrainfall) * 100;
      const cumdeparture = ((matcheddailyrainfallcum - item1.cummnormal) / item1.cummnormal) * 100
      if (matchingItem) {
        this.subdivisionfetchedDatadepcum.push({ ...item1, ...matchingItem, dailydeparturerainfall, cumdeparture });
      } else {
        // console.log("data not found")
      }
    });
    console.log(this.subdivisionfetchedDatadepcum)
  }

  processFetchedDataregiondaily(): void {
    this.regionfetchedDatadaily = [];
    this.districtdatacum.sort((a, b) => {
      return a.regionid - b.regionid;
    });
    let product = 0;
    let sum = 0;
    let cumproduct = 0;
    let previousregionid = null;
    let previousregionname = null;

    for (const item of this.districtdatacum) {
      if (previousregionid === item['regionid'] || previousregionid === null) {
        if (Number.isNaN(item.dailyrainfall)) {
          cumproduct += 0;
          product += 0;
          sum += 0
        }

        else {
          cumproduct += item['districtarea'] * item.dailyrainfallcum;
          product += item['districtarea'] * item.dailyrainfall;
          sum += item['districtarea'];
        }
      }

      else {
        this.regionfetchedDatadaily.push({
          dailyrainfall: product / sum,
          dailyrainfallcum: cumproduct / sum,
          RegionId: previousregionid,
          RegionName: previousregionname
        });
        product = item['districtarea'] * item.dailyrainfall;
        sum = item['districtarea'];
      }
      product;
      sum;
      previousregionid = item.regionid;
      previousregionname = item.regionname
    }
    this.regionfetchedDatadaily.push({
      dailyrainfall: product / sum,
      dailyrainfallcum: cumproduct / sum,
      RegionId: previousregionid,
      RegionName: previousregionname
    });
  }

  processFetchedDataregionnormal(): void {
    this.regionfetchedDatanormal = [];
    let regioncumnormal = 0;
    for (const item of this.fetchedData6) {
      let normal1: number
      if (this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' || this.currentDateNormal === 'Jun1' || this.currentDateNormal === 'Oct1') {
        normal1 = item[this.currentDateNormal]
      }
      else {
        normal1 = (item[this.currentDateNormal] - item[this.currentDateNormaly])
        if (normal1 === 0) {
          normal1 = 0.01
        }
      }
      regioncumnormal = item[this.currentDateNormal]
      this.regionfetchedDatanormal.push({
        regionid: item['regionid'],
        normalrainfall: normal1,
        cummnormal: regioncumnormal
      });
    }
    this.mergeregiondailyandnormal();
  }
  mergeregiondailyandnormal(): void {
    this.regionfetchedDatadepcum = []
    this.regionfetchedDatanormal.forEach((item1) => {
      const matchingItem = this.regionfetchedDatadaily.find((item2) => item1.regionid == item2.RegionId);
      let matcheddailyrainfall = 0;
      let matcheddailyrainfallcum = 0;
      if (matchingItem) {
        if (matchingItem.dailyrainfall !== undefined && !Number.isNaN(matchingItem.dailyrainfall)) {
          matcheddailyrainfall = matchingItem.dailyrainfall;
        }
        if (matchingItem.dailyrainfallcum !== undefined && !Number.isNaN(matchingItem.dailyrainfallcum)) {
          matcheddailyrainfallcum = matchingItem.dailyrainfallcum;
        }

      }
      const dailydeparturerainfall = ((matcheddailyrainfall - item1.normalrainfall) / item1.normalrainfall) * 100;
      const cumdeparture = ((matcheddailyrainfallcum - item1.cummnormal) / item1.cummnormal) * 100
      if (matchingItem) {
        this.regionfetchedDatadepcum.push({ ...item1, ...matchingItem, dailydeparturerainfall, cumdeparture });
      } else {
        // console.log("data not found")
      }
    });
    console.log(this.regionfetchedDatadepcum)
  }

  processFetchedDatacountrydaily(): void {
    this.countryfetchedDatadaily = [];
    let dailyrainfalldata = 0;
    let dailyrainfallcumdata = 0;
    for (const item of this.regionfetchedDatadaily) {
      dailyrainfalldata += item.dailyrainfall;
      dailyrainfallcumdata += item.dailyrainfallcum;
    }

    this.countryfetchedDatadaily.push({
      dailyrainfall: dailyrainfalldata/4,
      dailyrainfallcum : dailyrainfallcumdata/4,
      countryid: 1,
    });
    console.log(this.countryfetchedDatadaily)
  }

  processFetchedDatacountrynormal(): void {
    this.countryfetchedDatanormal = [];
    let countrycumnormal = 0;
    for (const item of this.fetchedData7) {
      let normal1: number
      if (this.currentDateNormal === 'Jan1' || this.currentDateNormal === 'Mar1' || this.currentDateNormal === 'Jun1' || this.currentDateNormal === 'Oct1') {
        normal1 = item[this.currentDateNormal]
      }
      else {
        normal1 = (item[this.currentDateNormal] - item[this.currentDateNormaly])
        if (normal1 === 0) {
          normal1 = 0.01
        }
      }
      countrycumnormal = item[this.currentDateNormal]
      this.countryfetchedDatanormal.push({
        normalcountryid: 1,
        normalrainfall: normal1,
        cummnormal: countrycumnormal
      });
    }
    this.mergecountrydailyandnormal();
  }

  mergecountrydailyandnormal(): void {
    this.countryfetchedDatadepcum = []

    this.countryfetchedDatanormal.forEach((item1) => {
      const matchingItem = this.countryfetchedDatadaily.find((item2) => item1.normalcountryid == item2.countryid);
      let matcheddailyrainfall = 0;
      let matcheddailyrainfallcum = 0;
      if (matchingItem) {
        if (matchingItem.dailyrainfall !== undefined && !Number.isNaN(matchingItem.dailyrainfall)) {
          matcheddailyrainfall = matchingItem.dailyrainfall;
        }
        if (matchingItem.dailyrainfallcum !== undefined && !Number.isNaN(matchingItem.dailyrainfallcum)) {
          matcheddailyrainfallcum = matchingItem.dailyrainfallcum;
        }
      }
      const dailydeparturerainfall = ((matcheddailyrainfall - item1.normalrainfall) / item1.normalrainfall) * 100;
      const cumdeparture = ((matcheddailyrainfallcum - item1.cummnormal) / item1.cummnormal) * 100
      if (matchingItem) {
        this.countryfetchedDatadepcum.push({ ...item1, ...matchingItem, dailydeparturerainfall, cumdeparture });
      } else {
        // console.log("data not found")
      }
    });
    console.log(this.countryfetchedDatadepcum)
  }



  private initMap(): void {
    this.map = L.map('map', {
      center: [24, 76.9629],
      zoom: this.initialZoom,
      scrollWheelZoom: false,
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
      content: '<i class="bi bi-arrows-fullscreen"></i>'
    });
    this.map.addControl(fullscreenControl);
  }
  private isFullscreen(): boolean {
    return !!(document.fullscreenElement || document.fullscreenElement ||
      document.fullscreenElement || document.fullscreenElement);
  }

  public month = this.months[this.today.getMonth()];
  public day = String(this.today.getDate()).padStart(2, '0');
  public sortedDataArray: any[] = [];
  public regions: any[] = [];
  public sortedSubDivisions: any[] = [];
  async pushDistrict(item: any, name: string) {
    if (item.statename == name) {
      this.sortedDataArray.push(item);
    }
  }

  async pushDistrict1(item: any, name: string) {
    if (item.subdivname == name) {
      this.sortedDataArray.push(item);
    }
  }

  async pushRegion(item: any, name: string) {
    if (item.regionname == name) {
      this.regions.push(item);
    }
  }

  async pushSubDivision(item: any, name: string) {
    if (item.subdivname == name) {
      this.sortedSubDivisions.push(item);
    }
  }

  downloadMapData(): void {
    this.sortedDataArray = [];
    const data = this.districtdatacum.sort((a, b) => a.subdivorder - b.subdivorder);
    const data1 = this.subdivisionfetchedDatadepcum;
    const data2 = this.statefetchedDatadepcum;
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
      const group = acc.find((group: any) => group.subdivname === current.subdivname);
      if (group) {
        var dist = group.districts.find((i: any) => i.districtname == current.districtname);
        if (!dist) {
          group.districts.push(current);
        }
      } else {
        acc.push({ subdivisionname: current.subdivname, districts: [current] });
      }
      return acc;
    }, []);
    groupedData.forEach((group: any) => {
      group.districts.sort((a: any, b: any) => a.districtname.localeCompare(b.districtname));
      group.districts.sort((a: any, b: any) => a.statename.localeCompare(b.statename));
    });
    const sortedData = groupedData.flatMap((group: any) => group.districts);

    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "ANDAMAN & NICOBAR ISLANDS (UT)");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "ARUNACHAL PRADESH");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "ASSAM");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "MEGHALAYA");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "NAGALAND");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "MANIPUR");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "MIZORAM");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "TRIPURA");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "SIKKIM");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "WEST BENGAL");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "ODISHA");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "JHARKHAND");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "BIHAR");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "UTTAR PRADESH");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "UTTARAKHAND");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "HARYANA");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "CHANDIGARH (UT)");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "DELHI (UT)");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "PUNJAB");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "HIMACHAL PRADESH");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "JAMMU & KASHMIR (UT)");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "LADAKH (UT)");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "RAJASTHAN");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "MADHYA PRADESH");
    })
    sortedData.forEach(async (item: any) => {
      if (item.subdivname == "GUJARAT REGION") {
        await this.pushDistrict(item, "GUJARAT");
      }
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "DADRA & NAGAR HAVELI AND DAMAN & DIU (UT)");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict1(item, "SAURASHTRA & KUTCH");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "GOA");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "MAHARASHTRA");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "CHHATTISGARH");
    })
    sortedData.forEach(async (item: any) => {
      if (item.subdivname == "COASTAL ANDHRA PRADESH & YANAM") {
        await this.pushDistrict(item, "PUDUCHERRY (UT)");
      }
    })
    sortedData.forEach(async (item: any) => {
      if (item.subdivname !== "RAYALSEEMA") {
        await this.pushDistrict(item, "ANDHRA PRADESH");
      }
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "TELANGANA");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict1(item, "RAYALSEEMA");
    })
    sortedData.forEach(async (item: any) => {
      if (item.subdivname == "TAMILNADU & PUDUCHERRY & KARAIKAL") {
        await this.pushDistrict(item, "TAMILNADU");
      }
    })
    sortedData.forEach(async (item: any) => {
      if (item.subdivname == "TAMILNADU & PUDUCHERRY & KARAIKAL" || item.subdivname == "KERALA & MAHE") {
        await this.pushDistrict(item, "PUDUCHERRY (UT)");
      }
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "KARNATAKA");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "KERALA");
    })
    sortedData.forEach(async (item: any) => {
      await this.pushDistrict(item, "LAKSHADWEEP (UT)");
    })

    this.sortedDataArray.forEach((item: any, index: number) => {
      let currentsubdivname = item.subdivname;

      if (currentsubdivname !== previoussubdivName) {

        data1.forEach((item2, index) => {
          if (currentsubdivname === item2.subdivname) {
            Subdivdailyindist = item2.dailyrainfall;
            Subdivnormalindist = item2.normalrainfall;
            Subdivdepindist = item2.dailydeparturerainfall;
            Subdivcumdailyindist = item2.dailyrainfallcum;
            Subdivcumnormalindist = item2.cummnormal;
            Subdivcumdepindist = item2.cumdeparture;
          }
        });
        const SubdivdailyindistFormatted = Subdivdailyindist !== null && Subdivdailyindist !== undefined && !Number.isNaN(Subdivdailyindist) ?(Math.round(Subdivdailyindist * 10) / 10).toFixed(1) : 'NA';
        const SubdivnormalindistFormatted = Subdivnormalindist !== null && Subdivnormalindist !== undefined && !Number.isNaN(Subdivnormalindist) ?(Math.round(Subdivnormalindist * 10) / 10).toFixed(1) : 'NA';
        const SubdivdepindistFormatted = (Math.round(Subdivdepindist * 10) / 10).toFixed(0);
        const SubdivcumdailyindistFormatted = Subdivcumdailyindist !== null && Subdivcumdailyindist !== undefined && !Number.isNaN(Subdivcumdailyindist) ?(Math.round(Subdivcumdailyindist * 10) / 10).toFixed(1) : 'NA';
        const SubdivcumnormalindistFormatted = Subdivcumnormalindist !== null && Subdivcumnormalindist !== undefined && !Number.isNaN(Subdivcumnormalindist) ?(Math.round(Subdivcumnormalindist * 10) / 10).toFixed(1) : 'NA';
        const SubdivcumdepindistFormatted = (Math.round(Subdivcumdepindist* 10) / 10).toFixed(0);
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
            content: this.getCatForRainfall(Number(SubdivcumdepindistFormatted)),
            styles: { fillColor: this.getColorForRainfall(SubdivcumdepindistFormatted) },
          },
        ])
      }
      let currentstatename = item.statename;
      if (currentstatename !== previousstateName &&item.subdivname != item.statename &&  item.statename != 'ANDAMAN & NICOBAR ISLANDS (UT)') {
        data2.forEach((item1, index) => {
          if (currentstatename === item1.statename) {
            statedailyindist = item1.dailyrainfall;
            statenormalindist = item1.normalrainfall;
            statedepindist = item1.dailydeparturerainfall;
            statecumdailyindist = item1.dailyrainfallcum;
            statecumnormalindist = item1.cummnormal;
            statecumdepindist = item1.cumdeparture;
          }
        });

        const statedailyindistFormatted = statedailyindist !== null && statedailyindist !== undefined && !Number.isNaN(statedailyindist) ?
    (Math.round(statedailyindist * 10) / 10).toFixed(1) : '0.0';
        const statenormalindistFormatted = statenormalindist !== null && statenormalindist !== undefined && !Number.isNaN(statenormalindist) ?
        (Math.round(statenormalindist * 10) / 10).toFixed(1): 'NA';
        const statedepindistFormatted = (Math.round(statedepindist * 10) / 10).toFixed(1);
        const statecumdailyindistFormatted = statecumdailyindist !== null && statecumdailyindist !== undefined && !Number.isNaN(statecumdailyindist) ?
        (Math.round(statecumdailyindist * 10) / 10).toFixed(1) : '0.0';
        const statecumnormalindistFormatted = statecumnormalindist !== null && statecumnormalindist !== undefined && !Number.isNaN(statecumnormalindist) ?
        (Math.round(statecumnormalindist * 10) / 10).toFixed(1): 'NA';
        const statecumdepindistFormatted = (Math.round(statecumdepindist*10)/10).toFixed(1);

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
            content: String(statedepindistFormatted) == "NaN" ? 0 + "%" : Math.round(Number(statedepindistFormatted)) + "%",
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
            content: String(statecumdepindistFormatted) == "NaN" ? 0 + "%" : Math.round(Number(statecumdepindistFormatted)) + "%",
            styles: { fillColor: '#dbb5f7' }, // Background color
          },
          {
            content: this.getCatForRainfall(statecumdepindist),
            styles: { fillColor: this.getColorForRainfall(statecumdepindist) },
          },
        ])

        rows.push([
          stateIndex, // Serial number
          item.districtname,
          item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? (Math.round(item.dailyrainfall * 10) / 10).toFixed(1) : ' ',
          item.normalrainfall !== null && item.normalrainfall !== undefined && !Number.isNaN(item.normalrainfall) ? item.normalrainfall.toFixed(1) : 'NA',
          (item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' ') == ' ' ? ' ' : (item.dailydeparturerainfall !== null && item.dailydeparturerainfall !== undefined && !Number.isNaN(item.dailydeparturerainfall) ? Math.round(item.dailydeparturerainfall) > 10000 ? 10000 + "%" : Math.round(item.dailydeparturerainfall) + "%" : 'NA'),
          {
            content: this.getCatForRainfall(Math.round(item.dailydeparturerainfall), item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' '),
            styles: { fillColor: this.getColorForRainfall(Math.round(item.dailydeparturerainfall), item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' ') }, // Background color
          },
          item.dailyrainfallcum !== null && item.dailyrainfallcum !== undefined && !Number.isNaN(item.dailyrainfallcum) && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfallcum.toFixed(1) : ' ',
          item.cummnormal !== null && item.cummnormal !== undefined && !Number.isNaN(item.cummnormal) ? item.cummnormal.toFixed(1) : ' ',
          !Number.isNaN(item.dailyrainfall) ? item.cumdeparture !== null && item.cumdeparture !== undefined && !Number.isNaN(item.cumdeparture) ? Math.round(item.cumdeparture) + "%" : '-100%' : ' ',
          {
            content: this.getCatForRainfall(!Number.isNaN(item.cumdeparture) ? Math.round(item.cumdeparture) : -100, !Number.isNaN(item.dailyrainfall) ? 'notnan' : ' '),
            styles: { fillColor: this.getColorForRainfall(!Number.isNaN(item.cumdeparture) ? Math.round(item.cumdeparture) : -100, !Number.isNaN(item.dailyrainfall) ? 'notnan' : ' ')}, // Background color
          },
        ]);
      }
      else {
        stateIndex++;
        rows.push([
          stateIndex, // Serial number
          item.districtname,
          item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? (Math.round(item.dailyrainfall * 10) / 10).toFixed(1) : ' ',
          item.normalrainfall !== null && item.normalrainfall !== undefined && !Number.isNaN(item.normalrainfall) ? item.normalrainfall.toFixed(1) : 'NA',
          (item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' ') == ' ' ? ' ' : (item.dailydeparturerainfall !== null && item.dailydeparturerainfall !== undefined && !Number.isNaN(item.dailydeparturerainfall) ? Math.round(item.dailydeparturerainfall) > 10000 ? 10000 + "%" : Math.round(item.dailydeparturerainfall) + "%" : 'NA'),
          {
            content: this.getCatForRainfall(Math.round(item.dailydeparturerainfall), item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' '),
            styles: { fillColor: this.getColorForRainfall(Math.round(item.dailydeparturerainfall), item.dailyrainfall !== null && item.dailyrainfall !== undefined && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfall.toFixed(1) : ' ') }, // Background color
          },
          item.dailyrainfallcum !== null && item.dailyrainfallcum !== undefined && !Number.isNaN(item.dailyrainfallcum) && !Number.isNaN(item.dailyrainfall) ? item.dailyrainfallcum.toFixed(1) : ' ',
          item.cummnormal !== null && item.cummnormal !== undefined && !Number.isNaN(item.cummnormal) ? item.cummnormal.toFixed(1) : ' ',
          !Number.isNaN(item.dailyrainfall) ? item.cumdeparture !== null && item.cumdeparture !== undefined && !Number.isNaN(item.cumdeparture) ? Math.round(item.cumdeparture) + "%" : '-100%' : ' ',
          {
            content: this.getCatForRainfall(!Number.isNaN(item.cumdeparture) ? Math.round(item.cumdeparture) : -100, !Number.isNaN(item.dailyrainfall) ? 'notnan' : ' '),
            styles: { fillColor: this.getColorForRainfall(!Number.isNaN(item.cumdeparture) ? Math.round(item.cumdeparture) : -100, !Number.isNaN(item.dailyrainfall) ? 'notnan' : ' ')}, // Background color
          },
        ]);
      }


      previoussubdivName = currentsubdivname;
      previousstateName = currentstatename;
    });
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
    const imgData = '/assets/images/IMDlogo_Ipart-iris.png'; // Replace with the actual image path
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
    const options2: any = {
      startY: doc.autoTable.previous.finalY + 10,
      margin: { left: marginLeft },
    };
    doc.addPage();
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

  loadGeoJSON(): void {
    this.http.get('assets/geojson/INDIA_DISTRICT.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);

          let rainfall: any;

          if(matchedData){

            if(Number.isNaN(matchedData.dailyrainfall)){
              rainfall = ' ';
            }
            else{
              rainfall = matchedData.dailydeparturerainfall;
            }

          }
          else{
            rainfall = -100
          }

          // const rainfall = matchedData ? matchedData.dailydeparturerainfall : -100;

          // const actual = matchedData && matchedData.dailyrainfall == 'NaN' ? ' ' : "notnull";
          const color = this.getColorForRainfall1(rainfall);
          return {
            fillColor: color,
            weight: 0.5,
            opacity: 2,
            color: 'black',
            fillOpacity: 2

          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const id1 = feature.properties['district'];
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);

          let rainfall: any;

          if(matchedData){

            if(Number.isNaN(matchedData.dailyrainfall)){
              rainfall = "NA";
            }
            else{
              rainfall = matchedData.dailydeparturerainfall;
            }

          }
          else{
            rainfall = -100
          }



          //const rainfall = matchedData && matchedData.dailydeparturerainfall !== null && matchedData.dailydeparturerainfall !== undefined && !Number.isNaN(matchedData.dailydeparturerainfall) ? matchedData.dailydeparturerainfall.toFixed(2) : 'NA';
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
  }

  getColorForRainfall1(rainfall: any): string {
    const numericId = rainfall;
    let cat = '';
    if (numericId == ' ') {
      return '#c0c0c0';
    }
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

    if (numericId == -100) {
      cat = 'NR';
      return '#ffffff';
    }

    else {
      cat = 'ND';
      return '#c0c0c0';
    }

  }

  getColorForRainfall(rainfall: any, actual?: string): string {
    const numericId = rainfall;
    let cat = '';
    if (actual == ' ') {
      return '#c0c0c0';
    }
    if (numericId >= 60) {
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
    if (numericId == -100) {
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
  getCatForRainfall(rainfall: number, actual?: string): string {
    const numericId = rainfall;
    if (actual == ' ') {
      return 'ND';
    }
    if (numericId >= 60) {
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
    htmlToImage.toJpeg(document.getElementById('map') as HTMLElement, { quality: 0.95, filter: this.filter })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'District_dep.jpeg';
        link.href = dataUrl;
        link.click();
      });
  }

  getNormalMap() {
    this.router.navigate(['/normal']);
  }
  getDepartureMap() {
    this.router.navigate(['/departure']);
  }
}

