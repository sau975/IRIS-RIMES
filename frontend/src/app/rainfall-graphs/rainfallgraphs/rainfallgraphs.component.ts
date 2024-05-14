import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { Router } from 'express';
import { EMPTY, concatMap } from 'rxjs';
import { DataService } from '../../data.service';
// import { DataService } from 'src/app/data.service';
// import { IndexedDBService } from 'src/app/indexed-db.service';

@Component({
  selector: 'app-rainfallgraphs',
  templateUrl: './rainfallgraphs.component.html',
  styleUrls: ['./rainfallgraphs.component.css']
})
export class RainfallgraphsComponent {

  // @Input() chartTitle : string | undefined;
  @Input() regionToDisplay : string | undefined;
  @Input() season : string | undefined;

  chart1: any;
  fromdate: string | undefined;
  todate: string | undefined;

  dummy_data1 : any;

  // for process the data to provide that into the chart for each region and season
  processData(season : string, regionToDisplay: string | undefined){
  }

  ngOnInit() {
    this.initCharts();
    this.fetchDataFromBackend();
  }


  updatecharts(dummy_data: { normal: number[]; daily: number[]; departure: never[]; }){
    // Generate data for the series
    const titleStyle = {
      color: '#333', 
      fontSize: '15px', 
      fontWeight: 'normal',
      fontFamily: 'Arial, sans-serif', 
    };

    // const dateList: string[] = [
    //   '01-01-2024',
    //   '02-01-2024',
    //   '03-01-2024',
    //   '04-01-2024',
    //   '05-01-2024',
    //   '06-01-2024',
    //   '07-01-2024',
    //   '08-01-2024',
    //   '09-01-2024',
    //   '10-01-2024',
    //   '11-01-2024',
    //   '12-01-2024',
    //   '13-01-2024',
    //   '14-01-2024',
    //   '15-01-2024',
    //   '16-01-2024',
    //   '17-01-2024',
    //   '18-01-2024',
    //   '19-01-2024',
    //   '20-01-2024',
    //   '21-01-2024',
    //   '22-01-2024',
    //   '23-01-2024',
    //   '24-01-2024',
    //   '25-01-2024',
    //   '26-01-2024',
    //   '27-01-2024',
    //   '28-01-2024'
    // ];
    

    const dateList: string[] = [
      '01-01-2024',
      '             ',
      '             ',
      '             ',
      '05-01-2024',
      '             ',
      '             ',
      '             ',
      '             ',
      '10-01-2024',
      '             ',
      '             ',
      '             ',
      '             ',
      '15-01-2024 ',
      '             ',
      '             ',
      '             ',
      '             ',
      '20-01-2024',
      '             ',
      '             ',
      '             ',
      '             ',
      '25-01-2024',
      '             ',
      '             ',
      '28-01-2024'
    ];
    
    this.chart1 = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        style : titleStyle,
        text: `Actual and Normal for the period ${this.fromdate} to ${this.todate}`
      },
      credits: {
        enabled: false
      },
      xAxis: {
        // tickInterval : 5,
        categories: dateList,
        title : {
          text : `<${Array(50).fill("-").join("")} Period ${Array(50).fill("-").join("")}>`
        }
      },

      yAxis: {
        tickInterval : 20,

        // categories: ['0', '20', '40', '60', '100'],
        title : {
          text : `<${Array(15).fill("-").join("")} Rainfall [mm] ${Array(15).fill("-").join("")}>`
        }
      },

      series: [
        {
          name: 'Actual',
          type: 'column',
          data: dummy_data['normal'],
          color: 'green'
          
        },
        {
          name: 'Normal',
          type: 'line',
          data: dummy_data['daily'],
          color : 'darkblue'
        }
      ]
    });
  }


  getnew(referenceList: any){
    const l = [];
    for(let j = 0; j < referenceList.length; j++) {
      const randomVariation = Math.random() * 2 - 30;
      const newValue = Math.round(referenceList[j] + randomVariation);
      l.push(newValue);
    }
    return l;
  }


  getanotherdummyData() {
    const referenceList: number[] = [10,12,14,15,16,17,19,20,25,27,27,28,29,32,35,37,39,40,42,45,49,50,56,57,57,58,60,61, 70, 72, 76, 80, 88, 91, 92, 95, 100];

    for(let i=0; i<referenceList.length; i++){
      referenceList[i]=referenceList[i]+20
    }

    // Function to introduce slight variations to a given list of values
    // function introduceVariations(list: number[]): number[] {
    //     return list.map((value) => {
    //         const randomVariation = Math.random() * 2 - 1; // Random value between -1 and 1
    //         const newValue = Math.round(value + randomVariation); // Round to the nearest integer
    //         return newValue;
    //     }).slice(0, 28);
    // }

    // function getnew(referenceList: number[]){
    //   const l = [];
    //   for(let j = 0; j < referenceList.length; j++) {
    //     const randomVariation = Math.random() * 2 - 1;
    //     const newValue = Math.round(referenceList[j] + randomVariation);
    //     l.push(newValue);
    //   }
    //   return l;
    // }
    let AllData: any[] = [];
    for(let j = 0; j < 3; j++) {
        const randomNumbers: number[] = this.getnew(referenceList);
        // for (let i = 0; i < 10; i++) {
        //     // randomNumbers.push(...introduceVariations(referenceList));
        //   randomNumbers.push(this.getnew(referenceList));

        // }
        AllData.push(randomNumbers);
    }

    console.log(AllData)
    return {
        'normal' : AllData[0],
        'daily' : AllData[1],
        'departure' : AllData[2]
    };
}


  // getanotherdummyData(){


    // let AllData:any = []
    // for(let j = 0; j<3; j++){
    //   const randomNumbers: number[] = [];
    //   for (let i = 0; i < 10; i++) {
    //     const randomNumber = Math.floor(Math.random() * 9) + 1;
    //     const randomMultipleOfTen = randomNumber * 10;
    //     randomNumbers.push(randomMultipleOfTen);
    //   }
    //   AllData.push(randomNumbers)
    // }
    // return {
    //   'normal' : AllData[0],
    //   'daily' : AllData[1],
    //   'departure' : AllData[2]
    // }






    // const referenceList: number[] = [10,12,14,15,16,17,19,20,25,27,27,28,29,32,35,37,39,40,42,45,49,50,56,57,57,58,60,61];

    // // Function to introduce slight variations to a given list of values
    // function introduceVariations(list: number[]): number[] {
    //     return list.map((value, index) => {
    //         const randomVariation = Math.random() * 2 - 1; // Random value between -1 and 1
    //         const newValue = Math.round(value + randomVariation); // Round to the nearest integer
    //         return newValue;
    //     });
    // }
    
    // const similarFlowList: number[] = introduceVariations(referenceList);
    // return similarFlowList;
  // }


  initCharts() {
    this.fromdate = "01-01-2024"
    this.todate = "28-02-2024"

    // this.dummy_data1 = this.getMyDummyData()
    this.dummy_data1 = this.getanotherdummyData();

    // const titleStyle = {
    //   color: '#333', 
    //   fontSize: '15px', 
    //   fontWeight: 'normal',
    //   fontFamily: 'Arial, sans-serif', 
    // };

    if(this.season=='winter'){
      this.fromdate = '01-01-2024'
      this.todate = '28-02-2024'
      if(this.regionToDisplay == 'COUNTRY INDIA'){ 
        //panindia
        // this.processData(this.season, this.regionToDisplay)

        // this.dummy_data1 = {
        //   'normal' : [10,12,14,15,16,17,19,20,25, 27,27,28,29, 32,35, 37, 39, 40,42, 42, ],
        //   'daily'  : [],
        // }
        this.updatecharts(this.dummy_data1)
      }
      else if(this.regionToDisplay == 'REGION : EAST AND NORTH EAST INDIA'){

        //eastandnortheastregion
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : NORTH WEST REGION'){
        //northwestregion
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : SOUTH PENINSULAR REGION'){
        //southpeninsularregion
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : CENTRAL INDIA'){
        //centralindiaregion
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
    }


    else if(this.season=='premonsoon'){
      this.fromdate = '01-03-2024'
      this.todate = '30-05-2024'
      if(this.regionToDisplay == 'COUNTRY INDIA'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)
      }
      else if(this.regionToDisplay == 'REGION : EAST AND NORTH EAST INDIA'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : NORTH WEST REGION'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : SOUTH PENINSULAR REGION'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : CENTRAL INDIA'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
    }



    else if(this.season=='monsoon'){
      this.fromdate = '01-06-2024'
      this.todate = '30-10-2024'
      if(this.regionToDisplay == 'COUNTRY INDIA'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)
      }
      else if(this.regionToDisplay == 'REGION : EAST AND NORTH EAST INDIA'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : NORTH WEST REGION'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : SOUTH PENINSULAR REGION'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : CENTRAL INDIA'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
    }
  

    else if(this.season=='postmonsoon'){
      this.fromdate = '01-11-2024'
      this.todate = '31-12-2024'
      if(this.regionToDisplay == 'COUNTRY INDIA'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)
      }
      else if(this.regionToDisplay == 'REGION : EAST AND NORTH EAST INDIA'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : NORTH WEST REGION'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : SOUTH PENINSULAR REGION'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
      else if(this.regionToDisplay == 'REGION : CENTRAL INDIA'){
        // this.processData(this.season, this.regionToDisplay)
        this.updatecharts(this.dummy_data1)  
      }
    }
  }


  getWinterdates(){
  }

  getpremonsoondates(){
  }

  getpostmonsoondates(){
  }

  getmonsoondates(){
  }

  getdata(){
    var startDate = new Date(new Date().getFullYear(), 2, 1); // March is represented by index 2
    var endDate = new Date(new Date().getFullYear(), this.today.getMonth(), this.today.getDate()); // April is represented by index 3
  }

  getStationData(){
    let stationtodistrict = [];
    let districttostate = [];
    let statetoregion = [];

    for (const item of this.fetchedMasterData) {

      // if (item[wd] != -999.9) {
      //   stationrainfallsum = stationrainfallsum + item[wd];
      //   numberofstations = numberofstations + 1;
      // }
      // else {
      //   stationrainfallsum = stationrainfallsum + 0;
      // }
    }
  }

  previousWeekWeeklyStartDate: string = '';
  previousWeekWeeklyEndDate: string = '';

  fetchDataFromBackend(): void {
    let data = this.dataService.fetchData6();
    console.log(data);
    // this.dataService.fetchMasterFile().pipe(
    //   concatMap(masterData => {
    //     this.fetchedMasterData = masterData;
    //     this.stationtodistrict();
    //     return this.dataService.fetchData();
    //   }),
    //   concatMap(fetchedData => {
    //     this.fetchedData = fetchedData;
    //     this.processFetchedData();
    //     this.processFetchedDatastatedaily();
    //     this.processFetchedDatasubdivdaily();
    //     this.processFetchedDataregiondaily();
    //     // this.processFetchedDatacountrydaily();
    //     return this.dataService.fetchData6();
    //   }),
    //   concatMap(fetchedData6 => {
    //     this.fetchedData6 = fetchedData6;
    //     this.processFetchedDataregionnormal();
    //     return EMPTY; // or any observable to complete the chain
    //   }),
    // ).subscribe(
    //   () => { },
    //   error => console.error('Error fetching data:', error)
    // );
  }













    private map: L.Map = {} as L.Map;
    private map1: L.Map = {} as L.Map;
    private map2: L.Map = {} as L.Map;
    private map3: L.Map = {} as L.Map;
    private map4: L.Map = {} as L.Map;
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
    statecountlargeexcess = 0
    statecountexcess = 0
    statecountnormal = 0
    statecountdeficient = 0
    statecountlargedeficient = 0
    statecountnorain = 0
    subdivcountlargeexcess = 0
    subdivcountexcess = 0
    subdivcountnormal = 0
    subdivcountdeficient = 0
    subdivcountlargedeficient = 0
    subdivcountnorain = 0
    dd: any;
    today = new Date();
    months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    weeklyDates: any[] = [];
    renderer: any;
  
    constructor(
      // private http: HttpClient,
      private dataService: DataService,
      // private router: Router,
      // private datePipe: DatePipe,
      // private indexedDBService: IndexedDBService
    ) {
      this.dateCalculation();
      this.dataService.fromAndToDate$.subscribe((value) => {
        if (value) {
          let fromAndToDates = JSON.parse(value);
          this.previousWeekWeeklyStartDate = fromAndToDates.fromDate;
          this.previousWeekWeeklyStartDate = fromAndToDates.toDate;
          this.weeklyDatesCalculation();
          this.dateCalculation();
          this.fetchDataFromBackend();
          console.log('BALU VIEW');
          console.log(this.regionfetchedDatadaily);   
          console.log(this.regionfetchedDatanormal);                                            
          console.log(this.regionfetchedDatadepcum);                                                                                             
        }
      });
    }

    dateCalculation() {
      // var todayDate = new Date();
      // this.today.setDate(todayDate.getDate() - 1);
  
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
      // console.log(this.currentDateDaily, "dateeeeee")
    }
  
    weeklyDatesCalculation() {
      if (this.previousWeekWeeklyStartDate && this.previousWeekWeeklyEndDate) {
        this.weeklyDates = [];
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
        this.today.setDate(new Date(this.previousWeekWeeklyStartDate).getDate());
      }
      console.log(this.weeklyDates, "iiiiiiii")
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
    regionfetchedDatadaily: any[] = [];                                                       //IMPORTANT
    regionfetchedDatanormal: any[] = [];                                                      //IMPORTANT
    regionfetchedDatadepcum: any[] = [];                                                      //IMPORTANT
    countryfetchedDatadaily: any[] = [];
    countryfetchedDatanormal: any[] = [];
    countryfetchedDatadepcum: any[] = [];
    public countrydaily = 0

    stationtodistrict() {
      this.stationtodistrictdata = [];
      let previousdistrictid: any = null;
      let previousdistrictname = "";
      let districtarea: any = null;
      let stationrainfallsum = 0;
      let numberofstations = 0;
      let previousstateid: any = null;
      let previousstatename = "";
      let previoussubdivid: any = null;
      let previoussubdivname = "";
      let subdivweights: any = null;
      let previousregionid: any = null;
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
              stateorder: prevstateorder,
              subdivid: previoussubdivid,
              subdivname: previoussubdivname,
              subdivorder: prevsubdivorder,
              regionid: previousregionid,
              regionname: previousregionname,
              regionorder: prevregionorder,
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
          stateorder: prevstateorder,
          subdivid: previoussubdivid,
          subdivname: previoussubdivname,
          subdivorder: prevsubdivorder,
          regionid: previousregionid,
          regionname: previousregionname,
          regionorder: prevregionorder,
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
        // districtcumnormal = 0
        // if(this.currentDateNormal === 'May1'){
        //   districtcumnormal = item[this.currentDateNormal] - item[this.currentDateNormaly]
        // }
        // if(this.currentDateNormal.startsWith('May') && this.currentDateNormal !== 'May1' ){
        //   districtcumnormal = districtcumnormal + (item[this.currentDateNormal] - item[this.currentDateNormaly])
        // }
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
  
        const cumdeparture = ((matcheddailyrainfallcum - item1.cummnormal) / item1.cummnormal) * 100
        if (matchingItem) {
          this.districtdatacum.push({ ...item1, ...matchingItem, dailydeparturerainfall, cumdeparture });
        } else {
          console.log("data not found")
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
            regionorder: previousregionorder,
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
        regionorder: previousregionorder,
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
          console.log("data not found")
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
            regionorder: previousregionorder,
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
        regionorder: previousregionorder,
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
        dailyrainfall: dailyrainfalldata / 4,
        dailyrainfallcum: dailyrainfallcumdata / 4,
        countryid: 1,
      });
      console.log(this.countryfetchedDatadaily)
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
      let allDates = [];
  
      var startDate = new Date(new Date().getFullYear(), 2, 1); // March is represented by index 2
      var endDate = new Date(new Date().getFullYear(), this.today.getMonth(), this.today.getDate()); // April is represented by index 3
  
      // Loop through the dates from March 1st to April 24th and format each date
      for (var currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        allDates.push(this.formatDate(currentDate));
      }
      return allDates;
    }

    formatDate(date:any) {
      // Get the year, month, and day from the date object
      var year = date.getFullYear().toString().slice(2); // Extract last two digits of the year
      var month = date.toLocaleString('default', { month: 'short' }); // Get the abbreviated month name
      var day = date.getDate().toString().padStart(2, '0'); // Ensure day is two digits with leading zero if necessary
  
      // Concatenate the formatted date components in the desired format
      var formattedDate = day + '_' + month + '_' + year;
  
      return formattedDate;
    }






























    // this.regionfetchedDatanormal = this.fetchNormalRegion();
    // this.regionfetchedDatadaily = this.fetchDailyRegion();
  

  fetchNormalRegion(){
    // return this.dataService.fetchData6();
  }

  fetchDailyRegion(){
    return [];
  }

  processTheRegionalAndNormalData(){

  }

  processRegionDates(){

  }


}


