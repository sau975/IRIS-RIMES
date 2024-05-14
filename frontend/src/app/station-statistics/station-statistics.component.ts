import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { DatePipe } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { Chart } from 'angular-highcharts';
import { DataService } from '../data.service';

@Component({
  selector: 'app-station-statistics',
  templateUrl: './station-statistics.component.html',
  styleUrls: ['./station-statistics.component.css'],
})
export class StationStatisticsComponent implements OnInit, OnDestroy {
  showStationDetails: boolean = false;
  showCompareData: boolean = false;
  showFirstMap: boolean = true;
  showSecondMap: boolean = false;
  stationType: string = '';


  showStationData(): void {
    this.selectedOption = 'station_details';
    this.updateChart(this.stationWeatherParameters[0]);
    this.submitParameterForm();
  }
  compareCharts(): void {
    this.selectedOption = 'compare_charts';
    this.updateChart(this.stationWeatherParameters[0]);
    this.updateChart(this.stationWeatherParameters[0]);
    this.toggleBottomNav();
    this.showCompareData = true;
  }
  toggleCompareSection(): void {
    this.selectedOption = this.selectedOption === 'compare_charts' ? 'station_details' : 'compare_charts';
    this.showCompareData = !this.showCompareData;
  }
  @ViewChild('timeMenuTrigger') trigger: MatMenuTrigger | undefined;
  selectedRegions: string[] = [];
  selectedStates: string[] = [];
  selectedMcs: string[] = [];
  tempfilteredStations: any[] = [];
  regionList: any[] = [];
  filteredMcs: any[] = [];
  filteredStates: any[] = [];
  selectedRegion: string = '';
  selectedState: string = '';
  selectedDistrict: string = '';
  selectedStation: string = '';
  filteredDistricts:any[]=[];
  filteredStations:any[]=[];
  totalstations: number = 0;
  notreceivedata: number = 0;
  receivedata: number = 0;
  pendingdata: number = 0;
  highestrecorded: number = 0;
  lowestrecorded: number = 0;
  veryLightRainFallStationCount: number = 0;
  lightRainfallStationCount: number = 0;
  modrateRainFallStationCount: number = 0;
  heavyRainFallStationCount: number = 0;
  veryHeavyRainfallStationCount: number = 0;
  extremelyHeavyRainfallStationCount: number = 0;
  loading = false;
  private stationObservationMap: any;
  type: any = 'rainfall';
  countryList: any;
  levelList: any;
  sourceList: any;
  parameterList: any[] = [];
  categoryList: any;
  thresholdList: any[] = [];
  currentHeavyThreshold: any | null = null;
  currentExtremeThreshold: any | null = null;
  weatherDataList: any[] = [];
  displayedWeatherDataListColumns: string[] = ['date', 'max', 'avg', 'min'];
  selectedLevel: any;
  shapeFilePath: any = '';
  selectedSource: any;
  parameterId: any = 1;
  alertCategoryId: any = 1;
  parameterName = 'rf';
  selectedWeatherParameterDetails: any | null = null;
  form: FormGroup = new FormGroup({});

  admEn: any;
  admPcode: any;

  sources: any;
  levels: any;

  dataTypeSlider: boolean = false;

  zoom_level: any = 7;

  defaultDataSourceDetails!: any;
  defaultLevelDetails!: any;
  endTime: any;
  arrowRotation = 0;
  existingstationdata: any[] = [];
  stationWeatherParameters: any[] = [

    {
      text: 'Hourly Data',
      weatherParams: 'rf',
      colors: [
        '#808080',
        '#90ee90',
        '#008000',
        '#add8e6',
        '#0000ff',
        '#ffd700',
        '#ff8c00',
      ],
      categoryOptions: [
        { text: 'No Rainfall', range: '(0mm)' },
        { text: 'Very light Rainfall', range: '(0.1mm - 2.4mm)' },
        { text: 'Light Rainfall', range: '(2.5mm - 7.5mm)' },
        { text: 'Moderate Rainfall', range: '(7.6mm - 64.4mm)' },
        { text: 'Heavy Rainfall', range: '(64.5mm - 124.4mm)' },
        { text: 'Very Heavy Rainfall', range: '(124.5mm - 244.4mm)' },
        { text: 'Extremely Heavy Rainfall', range: '(>244.5mm)' },
      ],
      hourWisedata: [
        { hour: '01', value: 0, unit: 'mm' },
        { hour: '02', value: 10, unit: 'mm' },
        { hour: '03', value: 0, unit: 'mm' },
        { hour: '04', value: 0, unit: 'mm' },
        { hour: '05', value: 0, unit: 'mm' },
        { hour: '06', value: 0, unit: 'mm' },
        { hour: '07', value: 0, unit: 'mm' },
        { hour: '08', value: 0, unit: 'mm' },
        { hour: '09', value: 0, unit: 'mm' },
        { hour: '10', value: 2.5, unit: 'mm' },
        { hour: '11', value: 0, unit: 'mm' },
        { hour: '12', value: 0, unit: 'mm' },
        { hour: '13', value: 0, unit: 'mm' },
        { hour: '14', value: 8.9, unit: 'mm' },
        { hour: '15', value: 0, unit: 'mm' },
        { hour: '16', value: 0, unit: 'mm' },
        { hour: '17', value: 0, unit: 'mm' },
        { hour: '18', value: 0, unit: 'mm' },
        { hour: '19', value: 0, unit: 'mm' },
        { hour: '20', value: 0, unit: 'mm' },
        { hour: '21', value: 0, unit: 'mm' },
        { hour: '22', value: 0, unit: 'mm' },
        { hour: '23', value: 0, unit: 'mm' },
        { hour: '24', value: 0, unit: 'mm' },
      ],
      // data: [
      //   { hour: '01', value: 0, unit: 'mm' }
      // ]
      data: [
        { hour: '01', value: 0, unit: 'mm' },
        { hour: '02', value: 10, unit: 'mm' },
        { hour: '03', value: 0, unit: 'mm' },
        { hour: '04', value: 0, unit: 'mm' },
        { hour: '05', value: 0, unit: 'mm' },
        { hour: '06', value: 0, unit: 'mm' },
        { hour: '07', value: 0, unit: 'mm' },
        { hour: '08', value: 0, unit: 'mm' },
        { hour: '09', value: 0, unit: 'mm' },
        { hour: '10', value: 2.5, unit: 'mm' },
        { hour: '11', value: 0, unit: 'mm' },
        { hour: '12', value: 0, unit: 'mm' },
        { hour: '13', value: 0, unit: 'mm' },
        { hour: '14', value: 8.9, unit: 'mm' },
        { hour: '15', value: 0, unit: 'mm' },
        { hour: '16', value: 0, unit: 'mm' },
        { hour: '17', value: 0, unit: 'mm' },
        { hour: '18', value: 0, unit: 'mm' },
        { hour: '19', value: 0, unit: 'mm' },
        { hour: '20', value: 0, unit: 'mm' },
        { hour: '21', value: 0, unit: 'mm' },
        { hour: '22', value: 0, unit: 'mm' },
        { hour: '23', value: 0, unit: 'mm' },
        { hour: '24', value: 0, unit: 'mm' },
        { hour: '25', value: 0, unit: 'mm' },
        { hour: '26', value: 0, unit: 'mm' },
        { hour: '27', value: 0, unit: 'mm' },
        { hour: '28', value: 0, unit: 'mm' },
        { hour: '29', value: 0, unit: 'mm' },
        { hour: '30', value: 0, unit: 'mm' },
      ],
      data1: [
        { hour: '07', value: 10, unit: 'mm' },
        { hour: '08', value: 10, unit: 'mm' },
        { hour: '09', value: 4, unit: 'mm' },
        { hour: '10', value: 0, unit: 'mm' },
        { hour: '11', value: 0, unit: 'mm' },
        { hour: '12', value: 0, unit: 'mm' },
        { hour: '13', value: 0, unit: 'mm' },
        { hour: '14', value: 0, unit: 'mm' },
        { hour: '15', value: 0, unit: 'mm' },
        { hour: '16', value: 0, unit: 'mm' },
        { hour: '17', value: 0, unit: 'mm' },
        { hour: '18', value: 0, unit: 'mm' },
        { hour: '19', value: 0, unit: 'mm' },
        { hour: '20', value: 0, unit: 'mm' },
        { hour: '21', value: 0, unit: 'mm' },
        { hour: '22', value: 0, unit: 'mm' },
        { hour: '23', value: 0, unit: 'mm' },
        { hour: '24', value: 0, unit: 'mm' },
        { hour: '25', value: 3.6, unit: 'mm' },
        { hour: '26', value: 0, unit: 'mm' },
        { hour: '27', value: 0, unit: 'mm' },
        { hour: '28', value: 0, unit: 'mm' },
        { hour: '29', value: 0, unit: 'mm' },
        { hour: '30', value: 0, unit: 'mm' },
      ],
      iconName: 'filter_drama',
    },
    {
      text: 'Historical Data',
      weatherParams: 'rf',
      colors: [
        '#808080',
        '#90ee90',
        '#008000',
        '#add8e6',
        '#0000ff',
        '#ffd700',
        '#ff8c00',
      ],
      categoryOptions: [
        { text: 'No Rainfall', range: '(0mm)' },
        { text: 'Very light Rainfall', range: '(0.1mm - 2.4mm)' },
        { text: 'Light Rainfall', range: '(2.5mm - 7.5mm)' },
        { text: 'Moderate Rainfall', range: '(7.6mm - 64.4mm)' },
        { text: 'Heavy Rainfall', range: '(64.5mm - 124.4mm)' },
        { text: 'Very Heavy Rainfall', range: '(124.5mm - 244.4mm)' },
        { text: 'Extremely Heavy Rainfall', range: '(>244.5mm)' },
      ],
      hourWisedata: [
        { hour: '2015', value: 0, unit: 'mm' },
        { hour: '2016', value: 10, unit: 'mm' },
        { hour: '2017', value: 0, unit: 'mm' },
        { hour: '2018', value: 0, unit: 'mm' },
        { hour: '2019', value: 0, unit: 'mm' },
        { hour: '2020', value: 0, unit: 'mm' },
        { hour: '2021', value: 0, unit: 'mm' },
        { hour: '2022', value: 0, unit: 'mm' },
        { hour: '2023', value: 0, unit: 'mm' },
        { hour: '2024', value: 2.5, unit: 'mm' },

      ],
      data: [
        { hour: '2015', value: 0, unit: 'mm' },
        { hour: '2016', value: 10, unit: 'mm' },
        { hour: '2017', value: 0, unit: 'mm' },
        { hour: '2018', value: 0, unit: 'mm' },
        { hour: '2019', value: 0, unit: 'mm' },
        { hour: '2020', value: 0, unit: 'mm' },
        { hour: '2021', value: 0, unit: 'mm' },
        { hour: '2022', value: 0, unit: 'mm' },
        { hour: '2023', value: 0, unit: 'mm' },
        { hour: '2024', value: 2.5, unit: 'mm' },

      ],
      data1: [
        { hour: '2015', value: 3, unit: 'mm' },
        { hour: '2016', value: 5, unit: 'mm' },
        { hour: '2017', value: 7, unit: 'mm' },
        { hour: '2018', value: 0, unit: 'mm' },
        { hour: '2019', value: 0, unit: 'mm' },
        { hour: '2020', value: 0, unit: 'mm' },
        { hour: '2021', value: 0, unit: 'mm' },
        { hour: '2022', value: 0, unit: 'mm' },
        { hour: '2023', value: 0, unit: 'mm' },
        { hour: '2024', value: 10, unit: 'mm' },
      ],
      iconName: 'filter_drama',
    },
  ];

  chart: any;
  selectedOption: string = 'station_details';
  selectedParameter: any;
  selectedCategory: any;
  selected_Date: Date = new Date();
  current_Date: any;
  manual_date_time: any;
  isSideNavOpen: boolean = true;
  isBottomNavOpen: boolean = false;
  selectedWeatherOption: string = 'Temperature';
  selectedWeatherData: any[] = this.stationWeatherParameters[0].data;
  mcdata = [
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"},
    {id:101, name: "mc1"}
  ]
  startNumber:number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dataService: DataService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      level: [0, Validators.required],
      source: [0, Validators.required],
    });

    this.initStationObservationMap();
    this.getCurrentDate();
    this.fetchDataFromBackend();
    this.loadGeoJSON();
  }

  getCurrentDate() {
    const date = new Date();
    const curr_Date = this.datePipe.transform(date, 'd MMM yyyy, h:mm a');
    if (curr_Date) {
      const [formattedDate, formattedTime]: string[] = curr_Date.split(', ');

      this.current_Date = {
        date: formattedDate,
        time: formattedTime,
      };
    }
  }

  onChangeRegion(checkedValues:any){
    this.selectedRegions = checkedValues;
    let tempMcs = this.existingstationdata.filter(item => {
      return checkedValues.some((value:any) => {
        return item.region == value;
      });
    });
    let tempfilteredMcs = Array.from(new Set(tempMcs.map(a => a.rmc_mc)));
    this.filteredMcs = tempfilteredMcs.map(a => { return {name: a}});
  }

  onChangeMc(checkedValues:any){
    this.selectedMcs = checkedValues;
    let tempStates = this.existingstationdata.filter(item => {
      return checkedValues.some((value:any) => {
        return item.rmc_mc == value;
      });
    });
    let tempfilteredStates = Array.from(new Set(tempStates.map(a => a.state)));
    this.filteredStates = tempfilteredStates.map(a => { return {name: a}});
  }

  onChangeState(checkedValues:any){
    let tempDistricts = this.existingstationdata.filter(item => {
      return checkedValues.some((value:any) => {
        return item.state == value;
      });
    })
    let tempfilteredDistricts = Array.from(new Set(tempDistricts.map(a => a.district)));
    this.filteredDistricts = tempfilteredDistricts.map(a => { return {name: a}});
    this.selectedDistrict = ''
  }

  onChangeDistrict(checkedValues:any){
    let tempStations = this.existingstationdata.filter(item => {
      return checkedValues.some((value:any) => {
        return item.district == value;
      });
    })
    let tempfilteredStations = Array.from(new Set(tempStations.map(a => a.station)));
    this.filteredStations = tempfilteredStations.map(a => { return {name: a}});
    console.log(this.filteredStations, "ppppppppppp")

    this.selectedStation = ''
  }

  onSelectStations(item:any){
    // this.selectedStation = item;
  }
  ngOnDestroy(): void {
    this.stationObservationMap.remove();
  }

  get formControls() {
    return this.form.controls;
  }

  shareCheckedList(item:any[]){
    console.log(item);
  }
  shareIndividualCheckedList(item:any){
    console.log(item);
  }

  showStationDailyData(){
    this.stationWeatherParameters[0].data = [];
    this.startNumber = 1;
    let stationData = this.existingstationdata.find(x => x.station == this.selectedStation);
    for(let i = 0; i < 30; i++){
      let date = String(this.startNumber).length > 1 ? this.startNumber : '0' + this.startNumber;
      let data = {
        hour: date, value: stationData[date + '_' + 'Apr_24'], unit: 'mm'
      }
      this.startNumber = this.startNumber + 1;
      this.stationWeatherParameters[0].data.push(data);
    }
  }

  updateMapAttribution(specialText: string) {
    // Get the Leaflet map container
    const mapContainer = this.stationObservationMap.getContainer();

    // Find the existing attribution element within the container
    const existingAttributionElement = mapContainer.querySelector(
      '.leaflet-control-attribution'
    );

    if (existingAttributionElement) {
      // Append your custom text to the existing attribution element
      existingAttributionElement.innerHTML += ` | ${specialText}`;
    }
  }

  private initStationObservationMap(): void {
    this.stationObservationMap = L.map('map_observations', {
      center: [24, 76.9629],
      zoom: 5,
      zoomControl: false,
      minZoom: 5,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.stationObservationMap);

    // L.marker([24, 76.9629]).addTo(this.stationObservationMap)
    //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //   .openPopup();

    L.control
      .zoom({ position: 'bottomright' })
      .addTo(this.stationObservationMap);

  }

  sourceChanged(sourceId: number) {
    this.selectedSource = this.sources.find((s: any) => s.id === sourceId);
  }

  alertCodeList: any = [];
  alertTypeList: any = [];

  currentAlertType: any = 'rain';
  genAlert(alertType: number, parameter: number) {
    this.weatherDataList = [];

    if (alertType == 1) {
      this.currentAlertType = 'heat';
      this.alertCategoryId = alertType;
      this.parameterId = parameter;
      this.parameterName = 'temp';
      this.selectedWeatherParameterDetails =
        this.parameterList?.find((item) => item.name === 'temp') ?? null;
    } else if (alertType == 2) {
      this.currentAlertType = 'cold';
      this.alertCategoryId = alertType;
      this.parameterId = parameter;
      this.parameterName = 'temp';
      this.selectedWeatherParameterDetails =
        this.parameterList?.find((item) => item.name === 'temp') ?? null;
    } else if (alertType == 3) {
      this.currentAlertType = 'rain';
      this.alertCategoryId = alertType;
      this.parameterId = parameter;
      this.parameterName = 'rf';
      this.selectedWeatherParameterDetails =
        this.parameterList?.find((item) => item.name === 'rf') ?? null;
    } else if (alertType == 4) {
      this.currentAlertType = 'windspd';
      this.alertCategoryId = alertType;
      this.parameterId = parameter;
      this.parameterName = 'windspd';
      this.selectedWeatherParameterDetails =
        this.parameterList?.find((item) => item.name === 'windspd') ?? null;
    }
  }

  rowColor(forecastData: any): string {
    if (!this.thresholdList) {
      // No threshold list, then no custom style
      return '';
    }

    if (!this.currentHeavyThreshold && !this.currentExtremeThreshold) {
      // No threshold found for this row, return false (no custom style)
      return '';
    }

    if (this.alertCategoryId === 2 && this.parameterId === 2) {
      if (
        this.currentExtremeThreshold &&
        forecastData.val_min &&
        this.currentExtremeThreshold?.max_value &&
        forecastData.val_min <= this.currentExtremeThreshold?.max_value
      ) {
        return this.currentExtremeThreshold?.alert_warning?.color;
      } else if (
        this.currentHeavyThreshold &&
        forecastData.val_min &&
        this.currentHeavyThreshold?.max_value &&
        forecastData.val_min <= this.currentHeavyThreshold?.max_value
      ) {
        return this.currentHeavyThreshold?.alert_warning?.color;
      } else {
        return '';
      }
    } else {
      if (
        this.currentExtremeThreshold &&
        forecastData.val_max &&
        this.currentExtremeThreshold?.min_value &&
        forecastData.val_max >= this.currentExtremeThreshold?.min_value
      ) {
        return this.currentExtremeThreshold?.alert_warning?.color;
      } else if (
        this.currentHeavyThreshold &&
        forecastData.val_max &&
        this.currentHeavyThreshold?.min_value &&
        forecastData.val_max >= this.currentHeavyThreshold?.min_value
      ) {
        return this.currentHeavyThreshold?.alert_warning?.color;
      } else {
        return '';
      }
    }
  }

  changeDate() {
    this.manual_date_time = this.formatDate(this.selected_Date);
  }

  changeTimeToggle(event: any) {
    this.dataTypeSlider = event.checked;

    if (!this.dataTypeSlider) {
      console.log('daily');
    } else {
      console.log('historical');
    }
  }

  confirmTimeDate(event: Event): void {
    if (this.trigger) {
      this.trigger.closeMenu();
    }
  }

  formatDate(date: any) {
    const dateObject = new Date(date);
    const formattedDateString = this.datePipe.transform(
      dateObject,
      'dd MMM yyyy'
    );

    const formattedTimeString = this.datePipe.transform(dateObject, 'h:mm a');

    return {
      date: formattedDateString,
      time: formattedTimeString,
    };
  }

  preventButtonBehaviour(event: Event) {
    event.preventDefault();
  }

  selectParameter(parameterObj: any) {
    this.selectedParameter = parameterObj;
    console.log('this.selectedParameter', this.selectedParameter);
    this.selectCategory(parameterObj.categoryOptions[0].text);
  }

  selectCategory(category: String) {
    this.selectedCategory = category;
    console.log('category', category);
  }
  toggleBottomNav() {
    this.isBottomNavOpen = true;
  }
  dateCalculation() {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    let newDate = new Date(this.selected_Date);
    let dd = String(newDate.getDate());
    const year = newDate.getFullYear();
    const currmonth = months[newDate.getMonth()];
    const selectedYear = String(year).slice(-2);
    return `${dd.padStart(2, '0')}_${currmonth}_${selectedYear}`;
  }

  fetchDataFromBackend(): void {
    this.notreceivedata = 0;
    this.receivedata = 0;
    this.pendingdata = 0;
    this.dataService.existingstationdata().subscribe({
      next: value => {
        this.existingstationdata = value;
        value.forEach((location:any) => {
          var markerCoords:any = [location.lat, location.lng];
          var markerOptions = {
              radius: 10, // Adjust the size of the marker here
              color: 'black', // Change the color of the marker here
              fillColor: this.getColorForRainfall1(location[this.dateCalculation()]), // Change the fill color of the marker here
              fillOpacity: 2.0 // Adjust the opacity of the fill color
          };

          // Create the circle marker and add it to the map
          var marker = L.circleMarker(markerCoords, markerOptions).addTo(this.stationObservationMap);
          // const marker = L.marker([location.lat, location.lng]).addTo(this.stationObservationMap)
          marker.bindPopup(location.station + '   ' + (location[this.dateCalculation()] != undefined ? location[this.dateCalculation()] : "-999.9"));
          // Show popup on marker hover
          marker.on('mouseover', function (e) {
            marker.openPopup();
          });

          // Hide popup when mouse leaves marker
          marker.on('mouseout', function (e) {
            marker.closePopup();
          });
        });

        let maxNumber = this.existingstationdata[0][this.dateCalculation()];
        for (let i = 1; i < this.existingstationdata.length; i++) {
          if (this.existingstationdata[i][this.dateCalculation()] > maxNumber) {
            maxNumber = this.existingstationdata[i][this.dateCalculation()];
          }
        }
        this.highestrecorded = maxNumber;

        let totalstationdata:any = this.existingstationdata.filter(x => x[this.dateCalculation()] > 0);
        if(totalstationdata && totalstationdata.length > 0){
          let minNumber = totalstationdata[0][this.dateCalculation()];
          for (let i = 1; i < totalstationdata.length; i++) {
            if (totalstationdata[i][this.dateCalculation()] < minNumber) {
              minNumber = totalstationdata[i][this.dateCalculation()];
            }
          }
          this.lowestrecorded = minNumber;
        }

        this.existingstationdata.forEach((element:any) => {
          if(element[this.dateCalculation()] == -999.9){
            this.notreceivedata = this.notreceivedata + 1;
          }
          if(element[this.dateCalculation()] > 0){
            this.receivedata = this.receivedata + 1;
          }
          if(element[this.dateCalculation()] == 0){
            this.pendingdata = this.pendingdata + 1;
          }
          if(element[this.dateCalculation()] > 0 && element[this.dateCalculation()] <= 2.4){
            this.veryLightRainFallStationCount = this.veryLightRainFallStationCount + 1;
          }
          if(element[this.dateCalculation()] >= 2.5 && element[this.dateCalculation()] <= 15.5){
            this.lightRainfallStationCount = this.lightRainfallStationCount + 1;
          }
          if(element[this.dateCalculation()] >= 15.6 && element[this.dateCalculation()] <= 64.4){
            this.modrateRainFallStationCount = this.modrateRainFallStationCount + 1;
          }
          if(element[this.dateCalculation()] >= 64.5 && element[this.dateCalculation()] <= 115.5){
            this.heavyRainFallStationCount = this.heavyRainFallStationCount + 1;
          }
          if(element[this.dateCalculation()] >= 115.6 && element[this.dateCalculation()] <= 204.4){
            this.veryHeavyRainfallStationCount = this.veryHeavyRainfallStationCount + 1;
          }
          if(element[this.dateCalculation()] >= 204.5){
            this.extremelyHeavyRainfallStationCount = this.extremelyHeavyRainfallStationCount + 1;
          }
        });
        let regionList = Array.from(new Set(this.existingstationdata.map(a => a.region)));
        this.regionList = regionList.map(x => {
          return {name: x}
        })

      },
      error: err => console.error('Error fetching data:', err)
    });
  }

  filterByDate(){
    this.fetchDataFromBackend();
    // if(this.selectedDistrict){
    //   this.filteredStations = this.existingstationdata.filter(s =>  s.district == this.selectedDistrict);
    // }
    // else if (this.selectedState) {
    //   this.filteredStations = this.existingstationdata.filter(s => s.state == this.selectedState);
    // }
    // else if (this.selectedRegion) {
    //   this.filteredStations = this.existingstationdata.filter(s => s.region == this.selectedRegion);
    // }
    // this.filteredStations.map(x => {
    //   return x.RainFall = x[this.dateCalculation()];
    // })
    // this.filteredStations.map(x => {
    //   return x.name = x.station;
    // })

    // this.totalstations = this.filteredStations.length;
    // this.filteredStations.forEach((element: any) => {
    //   if (element.RainFall == -999.9) {
    //     this.notreceivedata = this.notreceivedata + 1;
    //   }
    //   if (element.RainFall > 0) {
    //     this.receivedata = this.receivedata + 1;
    //   }
    // });
  }
  toggleMapDisplay(): void {
    this.showFirstMap = !this.showFirstMap;
    this.showSecondMap = !this.showSecondMap;
    if (this.showFirstMap) {
      this.loadGeoJSON();
    } else {
      this.loadGeoJSON1();
    }
  }
  loadGeoJSON(): void {

    this.http.get('assets/geojson/INDIA_STATE.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);

          let rainfall: any;

          if (matchedData) {

            if (Number.isNaN(matchedData.RainFall)) {
              rainfall = ' ';
            }
            else {
              rainfall = matchedData.RainFall;
            }
          }
          else {
            rainfall = -100
          }
          const color = this.getColorForRainfall1(rainfall);
          return {
            // fillColor: color,
            weight: 1,
            opacity: 1,
            color: 'black',
            // fillOpacity: 2
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          const id1 = feature.properties['district'];
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);
          let rainfall: any;
          if (matchedData) {
            if (Number.isNaN(matchedData.RainFall)) {
              rainfall = "NA";
            }
            else {
              rainfall = matchedData.RainFall;
            }
          }
          else {
            rainfall = -100
          }
        }
      }).addTo(this.stationObservationMap);
    });
  }

  loadGeoJSON1(): void {
    this.http.get('assets/geojson/INDIA_STATE.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);
          let rainfall: any;
          if (matchedData) {
            if (Number.isNaN(matchedData.RainFall)) {
              rainfall = ' ';
            }
            else {
              rainfall = matchedData.RainFall;
            }
          }
          else {
            rainfall = -100
          }
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
          if (matchedData) {
            if (Number.isNaN(matchedData.RainFall)) {
              rainfall = "NA";
            }
            else {
              rainfall = matchedData.RainFall;
            }
          }
          else {
            rainfall = -100
          }
        }
      }).addTo(this.stationObservationMap);
    });
  }
  loadGeoJSON2(): void {
    this.http.get('assets/geojson/INDIA_STATE.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);
          let rainfall: any;
          if (matchedData) {
            if (Number.isNaN(matchedData.RainFall)) {
              rainfall = ' ';
            }
            else {
              rainfall = matchedData.RainFall;
            }
          }
          else {
            rainfall = -100
          }
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
          if (matchedData) {
            if (Number.isNaN(matchedData.RainFall)) {
              rainfall = "NA";
            }
            else {
              rainfall = matchedData.RainFall;
            }
          }
          else {
            rainfall = -100
          }
        }
      }).addTo(this.stationObservationMap);
    });
  }

  findMatchingData(id: string): any | null {
    const matchedData = this.filteredStations.find((data: any) => data.district_code == id);
    if (matchedData) {
      return matchedData;
    }
    else {
      return null;
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

  submitParameterForm() {
    this.filterByDate();
    // const observationForm = {
    //   weatherParam: this.selectedParameter,
    //   observationDate: this.selected_Date
    //     ? this.manual_date_time.date
    //     : this.current_Date.date,
    //   observationTime: this.selected_Date
    //     ? this.manual_date_time.time
    //     : this.current_Date.time,
    // };
    this.toggleBottomNav();
    // this.loadGeoJSON();
    this.updateChart(this.stationWeatherParameters[0]);
    // this.showMarkerOnMap();
  }


  closePopup() {
    this.isBottomNavOpen = false;
  }

  selectStationDataOption(option: string): void {
    this.selectedOption = option;
  }

  updateChart(weatherOptions: any) {
    if (this.selectedOption === 'station_details') {
      // Display only one chart for station data
      var hoursArray;
      var valuesArray;
      if(this.stationType != 'aws'){
        hoursArray = weatherOptions.data.map(
          (dataPoint: any) => dataPoint.hour
        );
        valuesArray = weatherOptions.data.map(
          (dataPoint: any) => dataPoint.value
        );
      }else{
        hoursArray = weatherOptions.hourWisedata.map(
          (dataPoint: any) => dataPoint.hour
        );
        valuesArray = weatherOptions.hourWisedata.map(
          (dataPoint: any) => dataPoint.value
        );
      }
      const unit = weatherOptions.data[0].unit;
      this.chart = new Chart({
        chart: {
          type: 'line',
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: hoursArray,
        },
        yAxis: {
          title: {
            text: unit, // Display unit on y-axis title
          },
        },
        series: [
          {
            type: 'line',
            name: weatherOptions.text,
            data: valuesArray, // Display values array on y-axis
          },
        ],
      });

      this.selectedWeatherOption = weatherOptions.text;
      this.selectedWeatherData = weatherOptions.data;
    } else if (this.selectedOption === 'compare_charts') {
      // Display two charts for comparison
      const hoursArray = weatherOptions.data.map(
        (dataPoint: any) => dataPoint.hour
      );
      const valuesArray = weatherOptions.data.map(
        (dataPoint: any) => dataPoint.value
      );
      const valuesArray1 = weatherOptions.data1.map(
        (dataPoint: any) => dataPoint.value
      );
      const unit = weatherOptions.data[0].unit;
      this.chart = new Chart({
        chart: {
          type: 'line',
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          categories: hoursArray,
        },
        yAxis: {
          title: {
            text: unit, // Display unit on y-axis title
          },
        },
        series: [
          {
            type: 'line',
            name: weatherOptions.text,
            data: valuesArray, // Display values array on y-axis
          },
          {
            type: 'line',
            name: weatherOptions.text + ' 1',
            data: valuesArray1, // Display values array on y-axis
          },
        ],
      });

      this.selectedWeatherOption = weatherOptions.text;
      this.selectedWeatherData = weatherOptions.data;
    }
  }



  toggleDataParameter(param: string) {
    return param === this.selectedWeatherOption;
  }
}
