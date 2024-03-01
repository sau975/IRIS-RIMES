import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { DatePipe } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-station-statistics',
  templateUrl: './station-statistics.component.html',
  styleUrls: ['./station-statistics.component.css'],
})
export class StationStatisticsComponent implements OnInit, OnDestroy {
  @ViewChild('timeMenuTrigger') trigger: MatMenuTrigger | undefined;

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

  stationWeatherParameters: any[] = [
    {
      text: 'Temperature',
      weatherParams: 'temp',
      colors: [
        '#808080',
        '#00ffff',
        '#0000ff',
        '#00008b',
        '#006400',
        '#90ee90',
        '#ffff00',
        '#ffd580',
        '#ffa500',
        '#f30000',
        '#8b0000',
      ],
      categoryOptions: [
        { text: 'Temperature', range: '(> 45°C)' },
        { text: 'Temperature', range: '(40°C - 45°C)' },
        { text: 'Temperature', range: '(30°C - 40°C)' },
        { text: 'Temperature', range: '(10°C - 15°C)' },
        { text: 'Temperature', range: '(5°C - 10°C)' },
        { text: 'Temperature', range: '(5°C - 5°C)' },
      ],
      data: [
        { hour: '00:00', value: 22, unit: '°C' },
        { hour: '01:00', value: 22.5, unit: '°C' },
        { hour: '02:00', value: 22.8, unit: '°C' },
        { hour: '03:00', value: 23.2, unit: '°C' },
        { hour: '04:00', value: 23.7, unit: '°C' },
        { hour: '05:00', value: 24.1, unit: '°C' },
        { hour: '06:00', value: 24.5, unit: '°C' },
        { hour: '07:00', value: 24.9, unit: '°C' },
        { hour: '08:00', value: 25.2, unit: '°C' },
        { hour: '09:00', value: 25.6, unit: '°C' },
        { hour: '10:00', value: 26.0, unit: '°C' },
        { hour: '11:00', value: 26.3, unit: '°C' },
        { hour: '12:00', value: 26.5, unit: '°C' },
        { hour: '13:00', value: 26.7, unit: '°C' },
        { hour: '14:00', value: 26.8, unit: '°C' },
        { hour: '15:00', value: 26.9, unit: '°C' },
        { hour: '16:00', value: 26.8, unit: '°C' },
        { hour: '17:00', value: 26.6, unit: '°C' },
        { hour: '18:00', value: 26.3, unit: '°C' },
        { hour: '19:00', value: 26.0, unit: '°C' },
        { hour: '20:00', value: 25.6, unit: '°C' },
        { hour: '21:00', value: 25.2, unit: '°C' },
        { hour: '22:00', value: 24.8, unit: '°C' },
        { hour: '23:00', value: 24.4, unit: '°C' },
      ],
      iconName: 'device_thermostat',
    },
    {
      text: 'Relative Humidity',
      weatherParams: 'humidity',
      colors: [
        '#a52a2a',
        '#8b0000',
        '#ff0000',
        '#ffa500',
        '#fed8b1',
        '#7ea2c8',
        '#90ee90',
        '#008000',
        '#8467d7',
        '#800080',
      ],
      categoryOptions: [],
      data: [
        { hour: '00:00', value: 95, unit: '%' },
        { hour: '01:00', value: 93, unit: '%' },
        { hour: '02:00', value: 92, unit: '%' },
        { hour: '03:00', value: 91, unit: '%' },
        { hour: '04:00', value: 90, unit: '%' },
        { hour: '05:00', value: 88, unit: '%' },
        { hour: '06:00', value: 87, unit: '%' },
        { hour: '07:00', value: 85, unit: '%' },
        { hour: '08:00', value: 83, unit: '%' },
        { hour: '09:00', value: 82, unit: '%' },
        { hour: '10:00', value: 80, unit: '%' },
        { hour: '11:00', value: 78, unit: '%' },
        { hour: '12:00', value: 77, unit: '%' },
        { hour: '13:00', value: 75, unit: '%' },
        { hour: '14:00', value: 74, unit: '%' },
        { hour: '15:00', value: 72, unit: '%' },
        { hour: '16:00', value: 71, unit: '%' },
        { hour: '17:00', value: 70, unit: '%' },
        { hour: '18:00', value: 69, unit: '%' },
        { hour: '19:00', value: 68, unit: '%' },
        { hour: '20:00', value: 67, unit: '%' },
        { hour: '21:00', value: 66, unit: '%' },
        { hour: '22:00', value: 65, unit: '%' },
        { hour: '23:00', value: 64, unit: '%' },
      ],
      iconName: 'water',
    },
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
  isSideNavOpen: boolean = false;
  isBottomNavOpen: boolean = false;
  selectedWeatherOption: string = 'Temperature';
  selectedWeatherData: any[] = this.stationWeatherParameters[0].data;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      level: [0, Validators.required],
      source: [0, Validators.required],
    });

    this.initStationObservationMap();
    this.getCurrentDate();
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
      center: [
        28.7041,
        77.1025,
      ],
      zoom: 4,
      zoomControl: false,
      minZoom: 7,
    });

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/nazmul-rimes/cl14sra1f008s14pc9jkstfje/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibmF6bXVsLXJpbWVzIiwiYSI6ImNrOWFzeHNtcDA3MjAzbG50dnB0YmkxNnAifQ.usNB6Kf9PyFtKTUF1XI38g'
    ).addTo(this.stationObservationMap);

    // Add custom zoom controls to the bottom right corner
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

  loadForecastData(country: number, ucode: any, source: any, parameter: any) {
    this.isSideNavOpen = true;
  }

  closeWeatherDataList() {
    this.isSideNavOpen = false;
    this.weatherDataList = [];
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

  toggleSideNav() {
    this.isSideNavOpen = !this.isSideNavOpen;
    this.isBottomNavOpen = false;

    const button = document.querySelector('.sidebar-btn');

    if (button) {
      if (this.isSideNavOpen) {
        button.classList.add('rotate-180');
      } else {
        button.classList.remove('rotate-180');
      }
    }
  }

  toggleBottomNav() {
    this.isBottomNavOpen = !this.isBottomNavOpen;
  }

  submitParameterForm() {
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

    this.updateChart(this.stationWeatherParameters[0]);
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
