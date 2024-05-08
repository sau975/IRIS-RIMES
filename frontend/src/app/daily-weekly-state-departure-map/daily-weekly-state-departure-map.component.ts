import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
import { NavigationEnd, Router } from '@angular/router';
import { EMPTY, concatMap, filter } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-daily-weekly-state-departure-map',
  templateUrl: './daily-weekly-state-departure-map.component.html',
  styleUrls: ['./daily-weekly-state-departure-map.component.css']
})
export class DailyWeeklyStateDepartureMapComponent implements OnInit, AfterViewInit {

  @Input() previousWeekWeeklyStartDate: string = '';
  @Input() previousWeekWeeklyEndDate: string = '';
  selectedDate: Date = new Date();
  selectedWeek: string = '';
  selectedYear: string = '';
  isDaily: boolean = false;
  private initialZoom = 5;
  private map1: L.Map = {} as L.Map;
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
  countlargeexcess = 0
  countexcess = 0
  countnormal = 0
  countdeficient = 0
  countlargedeficient = 0
  countnorain = 0
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


  private updateLegendDetailsPositionsubdiv(fullscreen: boolean): void {
    const legendDetailsElement = document.querySelector('.legenddetails') as HTMLElement;
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
      center: [24, 76.9629],
      zoom: this.initialZoom,
      scrollWheelZoom: false,
    });

    this.map1.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map1.setZoom(this.initialZoom);
        this.updateLegendDetailsPositionsubdiv(true)
        this.loadGeoJSON()
      } else {
        this.map1.setZoom(this.initialZoom);
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
    this.map1.addControl(fullscreenControl);
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

  private clearTextElements(): void {
    for (const textElement of this.addedTextElements) {
      textElement.remove();
    }
    this.addedTextElements = [];
  }
  private addedTextElements: HTMLElement[] = [];

  loadGeoJSON(): void {
    this.countlargeexcess = 0
    this.countexcess = 0
    this.countnormal = 0
    this.countdeficient = 0
    this.countlargedeficient = 0
    this.countnorain = 0
    this.clearTextElements();
    this.http.get('assets/geojson/INDIA_STATE.json').subscribe((res: any) => {
      const geoJsonLayer = L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['state_code'];
          const matchedData = this.findMatchingDatastate(id2);
          const rainfall = matchedData ? matchedData.dailydeparturerainfall : -100;
          const actual = matchedData && matchedData.dailyrainfall == null ? ' ' : "notnull";
          const color = this.getColorForRainfallstate(rainfall, actual);
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
          const rainfall = matchedData && matchedData.dailydeparturerainfall !== null && matchedData.dailydeparturerainfall !== undefined && !Number.isNaN(matchedData.dailydeparturerainfall) ? matchedData.dailydeparturerainfall.toFixed(2) : 'NA';
          const dailyrainfall = matchedData && matchedData.dailyrainfall !== null && matchedData.dailyrainfall != undefined && !Number.isNaN(matchedData.dailyrainfall) ? Math.round(matchedData.dailyrainfall * 10) / 10 : 'NA';
          const normalrainfall = matchedData && !Number.isNaN(matchedData.normalrainfall) ? matchedData.normalrainfall.toFixed(2) : 'NA';
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
            center.lat = 16.5
            center.lng = 72.7
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

          console.log(id1)
          textElement.innerHTML = `
          <div style="text-align: center; line-height: 0.8;">
          <div style="color: #000000; font-weight: bold;text-wrap: nowrap; font-size: 10px; margin-bottom: 3px;">${dailyrainfall}(${Math.round(rainfall)})</div>
          <div style="color: #000000; font-weight: bold;text-wrap: nowrap; font-size: 10px; margin-bottom: 3px;">${id1}</div>
          <div style="color: #000000; font-weight: bold;text-wrap: nowrap; font-size: 10px;">${normalrainfall}</div>
          </div>`;
          console.log("bounds : ", bounds, "center : ", center, "lat : ", lat, "lng : ", lng)

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
      this.countlargeexcess = this.countlargeexcess +1
      cat = 'LE';
      return '#0096ff';
    }
    if (numericId >= 20 && numericId <= 59) {
      this.countexcess = this.countexcess +1
      cat = 'E';
      return '#32c0f8';
    }
    if (numericId >= -19 && numericId <= 19) {
      this.countnormal = this.countnormal +1
      cat = 'N';
      return '#00cd5b';
    }
    if (numericId >= -59 && numericId <= -20) {
      this.countdeficient = this.countdeficient + 1
      cat = 'D';
      return '#ff2700';
    }
    if (numericId >= -99 && numericId <= -60) {
      this.countlargedeficient  = this.countlargedeficient + 1
      cat = 'LD';
      return '#ffff20';
    }
    if (numericId == -100) {
      this.countnorain = this.countnorain + 1
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

