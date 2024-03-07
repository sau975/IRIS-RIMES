import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.css']
})
export class MapContainerComponent implements OnInit {
  inputValue: string = '';
  inputValue1: string = '';
  private map_canvas: L.Map = {} as L.Map;
  private initialZoom = 4;
  hasZoomedIn: boolean = false;
  hasZoomedOut: boolean = false;
  // public placeholderText: string;
  fetchedData: any;
  currentDateDaily: string;
  currentDateNormal: string;
  inputDateNormal: string;
  inputDateDaily: string;

  fetchDataFromBackend(): void {
    this.dataService.fetchData().subscribe(
      (data) => {
        this.fetchedData = data;
        this.processFetchedData();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  ngOnInit(): void {
    this.initMap();
    this.loadGeoJSON();
    this.fetchDataFromBackend();
  }


  private initMap(): void {
    this.map_canvas = L.map('map_canvas', {
      center: [23.0707, 80.0982],
      zoom: this.initialZoom,
      minZoom: this.initialZoom,
      maxZoom: this.initialZoom + 1
    });


    const fullscreenControl = new (L.Control as any).Fullscreen();
    this.map_canvas.addControl(fullscreenControl);

    this.map_canvas.on('fullscreenchange', () => {
      if (this.isFullscreen()) {
        this.map_canvas.setZoom(this.initialZoom + 1);
      } else {
        this.map_canvas.setZoom(this.initialZoom);
      }
    });
    this.map_canvas.on('zoomend', () => {
      if (this.map_canvas.getZoom() === this.initialZoom + 1) {
        this.hasZoomedIn = true;
      } else {
        this.hasZoomedIn = false;
      }

      if (this.map_canvas.getZoom() === this.initialZoom) {
        this.hasZoomedOut = false;

      } else if (this.map_canvas.getZoom() === this.initialZoom + 1) {
        this.hasZoomedOut = true;
      }
    });
  }

  private isFullscreen(): boolean {
    return !!(document.fullscreenElement || document.fullscreenElement ||
      document.fullscreenElement || document.fullscreenElement);
  }

  findMatchingData(id2: string): any | null {
    const matchedData = this.processedData.find((data: any) => data.districtID === id2);
    return matchedData || null;
  }
  constructor(private http: HttpClient, private dataService: DataService) {
    // this.placeholderText = this.formatDate(this.inputValue,  this.inputValue1);
    const today = new Date();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const dd = String(today.getDate()).padStart(2, '0');
    const currmonth = months[today.getMonth()];


    this.currentDateNormal = `${currmonth}-${dd}`;
    this.currentDateDaily = `${dd}_${currmonth}`;
    this.inputValue = this.inputValue.padStart(2, '0');
    this.inputValue1;
    this.inputDateNormal = `${this.inputValue1}-${this.inputValue}`;
    this.inputDateDaily = `${this.inputValue}_${this.inputValue1}`;

  }
  processedData: any[] = [];
  processFetchedData(): void {

    if (this.inputValue && this.inputValue1) {
      this.processedData = [];
      for (const item of this.fetchedData) {
        let den = item[this.inputDateDaily];
        if (item[this.inputDateDaily] == 0) {
          den = 1;
        }
        this.processedData.push({ districtID: item.districtid, Rainfall: (((item[this.inputDateNormal] - item[this.inputDateDaily]) / den)) });
      }
    }
    else {
      this.processedData = [];
      for (const item of this.fetchedData) {
        let den = item[this.currentDateDaily];
        if (item[this.currentDateDaily] == 0) {
          den = 1;
        }
        this.processedData.push({ districtID: item.districtid, Rainfall: (((item[this.currentDateNormal] - item[this.currentDateDaily]) / den)) });
      }
    }
  }
  loadGeoJSON1(): void {
    if (this.inputValue && this.inputValue1) {
      this.inputValue = this.inputValue.padStart(2, '0');
      this.inputDateNormal = `${this.inputValue1}-${this.inputValue}`;
      this.inputDateDaily = `${this.inputValue}_${this.inputValue1}`;
      this.processFetchedData();
      const name = 'name';
      this.http.get('assets/geojson/INDIA_DISTRICT.json').subscribe((res: any) => {
        L.geoJSON(res, {
          style: (feature: any) => {
            const id2 = feature.properties['OBJECTID'];
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
            const id2 = feature.properties['OBJECTID'];
            const matchedData = this.findMatchingData(id2);

            layer.bindPopup(`name: ${feature.properties[name]}`);
            layer.on('mouseover', () => {
              layer.openPopup();
            });
            layer.on('mouseout', () => {
              layer.closePopup();
            });
          }
        }).addTo(this.map_canvas);
      });

    }
  }
  loadGeoJSON(): void {
    const name = 'name';
    this.http.get('assets/geojson/INDIA_DISTRICT.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['OBJECTID'];
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
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingData(id2);

          layer.bindPopup(`name: ${feature.properties[name]}`);
          layer.on('mouseover', () => {
            layer.openPopup();
          });
          layer.on('mouseout', () => {
            layer.closePopup();
          });
        }
      }).addTo(this.map_canvas);
    });

  }







  getColorForRainfall(rainfall: number): string {
    const numericId = rainfall;
    // console.log(numericId);
    if (numericId >= 60) {
      return '#0096ff';
    }
    if (numericId >= 20 && numericId <= 59) {
      return '#32c0f8';
    }
    if (numericId >= -19 && numericId <= 19) {
      return '#00cd5b';
    }
    if (numericId >= -59 && numericId <= -20) {
      return '#ff2700';
    }
    if (numericId >= -99 && numericId <= -60) {
      return '#ffff20';
    }
    if (numericId <= -100) {
      return '#ffffff';
    }
    else {
      return '#c0c0c0';
    }
  }
  downloadMapImage(): void {
    html2canvas.default(document.getElementById('map_canvas') as HTMLElement).then(canvas => {
      const link = document.createElement('a');
      link.download = 'map_canvas.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

}
