import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('timeMenuTrigger') trigger: MatMenuTrigger | undefined;
  selectedRegion: string = '';
  selectedState: string = '';
  selectedDistrict: string = '';
  regionList:any[]=[];
  filteredStates:any[]=[];
  filteredDistricts:any[]=[];
  filteredStations:any[]=[];
  totalstations: number = 0;
  notreceivedata: number = 0;
  receivedata: number = 0;
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
    // {
    //   text: 'Temperature',
    //   weatherParams: 'temp',
    //   colors: [
    //     '#808080',
    //     '#00ffff',
    //     '#0000ff',
    //     '#00008b',
    //     '#006400',
    //     '#90ee90',
    //     '#ffff00',
    //     '#ffd580',
    //     '#ffa500',
    //     '#f30000',
    //     '#8b0000',
    //   ],
    //   categoryOptions: [
    //     { text: 'Temperature', range: '(> 45°C)' },
    //     { text: 'Temperature', range: '(40°C - 45°C)' },
    //     { text: 'Temperature', range: '(30°C - 40°C)' },
    //     { text: 'Temperature', range: '(10°C - 15°C)' },
    //     { text: 'Temperature', range: '(5°C - 10°C)' },
    //     { text: 'Temperature', range: '(5°C - 5°C)' },
    //   ],
    //   data: [
    //     { hour: '00:00', value: 22, unit: '°C' },
    //     { hour: '01:00', value: 22.5, unit: '°C' },
    //     { hour: '02:00', value: 22.8, unit: '°C' },
    //     { hour: '03:00', value: 23.2, unit: '°C' },
    //     { hour: '04:00', value: 23.7, unit: '°C' },
    //     { hour: '05:00', value: 24.1, unit: '°C' },
    //     { hour: '06:00', value: 24.5, unit: '°C' },
    //     { hour: '07:00', value: 24.9, unit: '°C' },
    //     { hour: '08:00', value: 25.2, unit: '°C' },
    //     { hour: '09:00', value: 25.6, unit: '°C' },
    //     { hour: '10:00', value: 26.0, unit: '°C' },
    //     { hour: '11:00', value: 26.3, unit: '°C' },
    //     { hour: '12:00', value: 26.5, unit: '°C' },
    //     { hour: '13:00', value: 26.7, unit: '°C' },
    //     { hour: '14:00', value: 26.8, unit: '°C' },
    //     { hour: '15:00', value: 26.9, unit: '°C' },
    //     { hour: '16:00', value: 26.8, unit: '°C' },
    //     { hour: '17:00', value: 26.6, unit: '°C' },
    //     { hour: '18:00', value: 26.3, unit: '°C' },
    //     { hour: '19:00', value: 26.0, unit: '°C' },
    //     { hour: '20:00', value: 25.6, unit: '°C' },
    //     { hour: '21:00', value: 25.2, unit: '°C' },
    //     { hour: '22:00', value: 24.8, unit: '°C' },
    //     { hour: '23:00', value: 24.4, unit: '°C' },
    //   ],
    //   iconName: 'device_thermostat',
    // },
    // {
    //   text: 'Relative Humidity',
    //   weatherParams: 'humidity',
    //   colors: [
    //     '#a52a2a',
    //     '#8b0000',
    //     '#ff0000',
    //     '#ffa500',
    //     '#fed8b1',
    //     '#7ea2c8',
    //     '#90ee90',
    //     '#008000',
    //     '#8467d7',
    //     '#800080',
    //   ],
    //   categoryOptions: [],
    //   data: [
    //     { hour: '00:00', value: 95, unit: '%' },
    //     { hour: '01:00', value: 93, unit: '%' },
    //     { hour: '02:00', value: 92, unit: '%' },
    //     { hour: '03:00', value: 91, unit: '%' },
    //     { hour: '04:00', value: 90, unit: '%' },
    //     { hour: '05:00', value: 88, unit: '%' },
    //     { hour: '06:00', value: 87, unit: '%' },
    //     { hour: '07:00', value: 85, unit: '%' },
    //     { hour: '08:00', value: 83, unit: '%' },
    //     { hour: '09:00', value: 82, unit: '%' },
    //     { hour: '10:00', value: 80, unit: '%' },
    //     { hour: '11:00', value: 78, unit: '%' },
    //     { hour: '12:00', value: 77, unit: '%' },
    //     { hour: '13:00', value: 75, unit: '%' },
    //     { hour: '14:00', value: 74, unit: '%' },
    //     { hour: '15:00', value: 72, unit: '%' },
    //     { hour: '16:00', value: 71, unit: '%' },
    //     { hour: '17:00', value: 70, unit: '%' },
    //     { hour: '18:00', value: 69, unit: '%' },
    //     { hour: '19:00', value: 68, unit: '%' },
    //     { hour: '20:00', value: 67, unit: '%' },
    //     { hour: '21:00', value: 66, unit: '%' },
    //     { hour: '22:00', value: 65, unit: '%' },
    //     { hour: '23:00', value: 64, unit: '%' },
    //   ],
    //   iconName: 'water',
    // },
    {
      text: 'Rainfall',
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
      data: [
        { hour: '00:00', value: 0, unit: 'mm' },
        { hour: '01:00', value: 0, unit: 'mm' },
        { hour: '02:00', value: 0, unit: 'mm' },
        { hour: '03:00', value: 0, unit: 'mm' },
        { hour: '04:00', value: 0, unit: 'mm' },
        { hour: '05:00', value: 0, unit: 'mm' },
        { hour: '06:00', value: 0, unit: 'mm' },
        { hour: '07:00', value: 0, unit: 'mm' },
        { hour: '08:00', value: 0, unit: 'mm' },
        { hour: '09:00', value: 0, unit: 'mm' },
        { hour: '10:00', value: 0, unit: 'mm' },
        { hour: '11:00', value: 0, unit: 'mm' },
        { hour: '12:00', value: 0, unit: 'mm' },
        { hour: '13:00', value: 0, unit: 'mm' },
        { hour: '14:00', value: 0, unit: 'mm' },
        { hour: '15:00', value: 0, unit: 'mm' },
        { hour: '16:00', value: 0, unit: 'mm' },
        { hour: '17:00', value: 0, unit: 'mm' },
        { hour: '18:00', value: 0, unit: 'mm' },
        { hour: '19:00', value: 0, unit: 'mm' },
        { hour: '20:00', value: 0, unit: 'mm' },
        { hour: '21:00', value: 0, unit: 'mm' },
        { hour: '22:00', value: 0, unit: 'mm' },
        { hour: '23:00', value: 0, unit: 'mm' },
      ],
      iconName: 'filter_drama',
    },
  ];

  chart: any;
  selectedOption: string = 'station_details';
  selectedParameter: any;
  selectedCategory: any;
  selected_Date: any;
  current_Date: any;
  manual_date_time: any;
  isSideNavOpen: boolean = true;
  isBottomNavOpen: boolean = false;
  selectedWeatherOption: string = 'Temperature';
  selectedWeatherData: any[] = this.stationWeatherParameters[0].data;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dataService: DataService,
    private http: HttpClient
  ) {}

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

  onChangeRegion(){
    debugger
    let tempStates = this.existingstationdata.filter(s => s.region == this.selectedRegion);
    console.log(tempStates, "=======")
    this.filteredStates = Array.from(new Set(tempStates.map(a => a.state)));
    this.selectedState = ''
    this.selectedDistrict = ''
  }

  onChangeState(){
    let tempDistricts = this.existingstationdata.filter(d => d.state == this.selectedState);
    this.filteredDistricts = Array.from(new Set(tempDistricts.map(a => a.district)));
    this.selectedDistrict = ''
  }

  ngOnDestroy(): void {
    this.stationObservationMap.remove();
  }

  get formControls() {
    return this.form.controls;
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
      zoom: 4,
      zoomControl: false,
      minZoom: 5,
    });

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

  // loadForecastData(country: number, ucode: any, source: any, parameter: any) {
  //   this.isSideNavOpen = true;
  // }

  // closeWeatherDataList() {
  //   this.isSideNavOpen = false;
  //   this.weatherDataList = [];
  // }

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

  // toggleSideNav() {
  //   this.isSideNavOpen = !this.isSideNavOpen;
  //   this.isBottomNavOpen = false;

  //   const button = document.querySelector('.sidebar-btn');

  //   if (button) {
  //     if (this.isSideNavOpen) {
  //       button.classList.add('rotate-180');
  //     } else {
  //       button.classList.remove('rotate-180');
  //     }
  //   }
  // }

  toggleBottomNav() {
    this.isBottomNavOpen = true;
  }
  dateCalculation() {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    let newDate = new Date(!this.selected_Date ? this.current_Date.date : this.manual_date_time.date);
    let dd = String(newDate.getDate());
    const year = newDate.getFullYear();
    const currmonth = months[newDate.getMonth()];
    const selectedYear = String(year).slice(-2);
    return `${dd.padStart(2, '0')}_${currmonth}_${selectedYear}`;
  }

  fetchDataFromBackend(): void {
    this.notreceivedata = 0;
    this.receivedata = 0;
    this.dataService.existingstationdata().subscribe({
      next: value => {
        this.existingstationdata = value;
        this.regionList = Array.from(new Set(this.existingstationdata.map(a => a.region)));
      },
      error: err => console.error('Error fetching data:', err)
    });
  }

  filterByDate(){
    if(this.selectedDistrict){
      this.filteredStations = this.existingstationdata.filter(s =>  s.district == this.selectedDistrict);
    }
    else if(this.selectedState){
      this.filteredStations = this.existingstationdata.filter(s =>  s.state == this.selectedState);
    }
    else if(this.selectedRegion){
      this.filteredStations = this.existingstationdata.filter(s =>  s.region == this.selectedRegion);
    }
    this.filteredStations.map(x => {
      return x.RainFall = x[this.dateCalculation()];
    })
    this.totalstations = this.filteredStations.length;
    this.filteredStations.forEach((element:any) => {
      if(element.RainFall == -999.9){
        this.notreceivedata = this.notreceivedata + 1;
      }
      if(element.RainFall > 0){
        this.receivedata = this.receivedata + 1;
      }
    });
  }

  loadGeoJSON(): void {
    this.http.get('assets/geojson/INDIA_DISTRICT.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['district_c'];
          const matchedData = this.findMatchingData(id2);

          let rainfall: any;

          if(matchedData){

            if(Number.isNaN(matchedData.RainFall)){
              rainfall = ' ';
            }
            else{
              rainfall = matchedData.RainFall;
            }

          }
          else{
            rainfall = -100
          }

          // const rainfall = matchedData ? matchedData.dailydeparturerainfall : -100;

          // const actual = matchedData && matchedData.RainFall == 'NaN' ? ' ' : "notnull";
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

            if(Number.isNaN(matchedData.RainFall)){
              rainfall = "NA";
            }
            else{
              rainfall = matchedData.RainFall;
            }

          }
          else{
            rainfall = -100
          }



          //const rainfall = matchedData && matchedData.dailydeparturerainfall !== null && matchedData.dailydeparturerainfall !== undefined && !Number.isNaN(matchedData.dailydeparturerainfall) ? matchedData.dailydeparturerainfall.toFixed(2) : 'NA';
          // const dailyrainfall = matchedData && matchedData.dailyrainfall !== null && matchedData.dailyrainfall != undefined && !Number.isNaN(matchedData.dailyrainfall) ? matchedData.dailyrainfall.toFixed(2) : 'NA';
          // const normalrainfall = matchedData && !Number.isNaN(matchedData.normalrainfall) ? matchedData.normalrainfall.toFixed(2) : 'NA';
          // const popupContent = `
          //   <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
          //     <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
          //     <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${dailyrainfall}</div>
          //     <div style="color: #002467; font-weight: bold; font-size: 10px;">NORMAL RAINFALL: ${normalrainfall}</div>
          //     <div style="color: #002467; font-weight: bold; font-size: 10px;">DEPARTURE: ${rainfall}% </div>
          //   </div>
          // `;
          // layer.bindPopup(popupContent);
          // layer.on('mouseover', () => {
          //   layer.openPopup();
          // });
          // layer.on('mouseout', () => {
          //   layer.closePopup();
          // });
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
    const observationForm = {
      weatherParam: this.selectedParameter,
      observationDate: this.selected_Date
        ? this.manual_date_time.date
        : this.current_Date.date,
      observationTime: this.selected_Date
        ? this.manual_date_time.time
        : this.current_Date.time,
    };

    this.toggleBottomNav();
    this.loadGeoJSON();
    this.updateChart(this.stationWeatherParameters[0]);
  }

  closePopup(){
    this.isBottomNavOpen = false;
  }

  selectStationDataOption(option: string): void {
    this.selectedOption = option;
  }

  updateChart(weatherOptions: any) {
    console.log('weatherOptions 1', weatherOptions);
    const hoursArray = weatherOptions.data.map(
      (dataPoint: any) => dataPoint.hour
    );
    const valuesArray = weatherOptions.data.map(
      (dataPoint: any) => dataPoint.value
    );
    const unit = weatherOptions.data[0].unit;

    //updating chart
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
  }

  toggleDataParameter(param: string) {
    return param === this.selectedWeatherOption;
  }
}
