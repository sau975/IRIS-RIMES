import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { DataService } from '../data.service';
@Component({
  selector: 'app-daily-map',
  templateUrl: './daily-map.component.html',
  styleUrls: ['./daily-map.component.css']
})
export class DailyMapComponent {
  inputValue: string = '';
  inputValue1: string = '';
  private initialZoom = 4;
  private map: L.Map = {} as L.Map;
  private map1: L.Map = {} as L.Map;
  private map2: L.Map = {} as L.Map;
  private map3: L.Map = {} as L.Map;
  fetchedData: any;
  currentDateNormal: string;
  currentDateDaily: string;
  inputDateNormal: string;
  inputDateDaily: string;
  fetchedData1: any;
  fetchedData2: any;
  fetchedData3: any;
  fetchedData4: any;
  fetchedData5: any;
  fetchedData6: any;

  constructor(private http: HttpClient, private dataService: DataService) {
    // this.placeholderText = this.formatDate(this.inputValue,  this.inputValue1);
    const today = new Date();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const dd = String(today.getDate());
    const currmonth = months[today.getMonth()];
    const year = String(today.getFullYear());
    // console.log(year);

    this.currentDateNormal = `${currmonth}${dd}`;

    this.currentDateDaily = `${dd.padStart(2, '0')}_${currmonth}`;

    this.inputDateNormal = `${this.inputValue1}${this.inputValue}`;
    this.inputDateDaily = `${this.inputValue.padStart(2, '0')}_${this.inputValue1}`;

  }
  ngOnInit(): void {
    this.initMap();
    this.loadGeoJSON();
    this.loadGeoJSON1();
    this.fetchDataFromBackend();
  }
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
    this.dataService.fetchData1().subscribe(
      (data) => {
        this.fetchedData1 = data;
        this.processFetchedDatastatedaily();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    this.dataService.fetchData2().subscribe(
      (data) => {
        this.fetchedData2 = data;
        this.processFetchedDatasubdivdaily();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    this.dataService.fetchData3().subscribe(
      (data) => {
        this.fetchedData3 = data;
        this.processFetchedDataregiondaily();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  findMatchingData(id: string): any | null {
    const matchedData = this.processedData.find((data: any) => data.districtdailyID === id);
    return matchedData || null;
  }
  findMatchingDatastate(id: string): any | null {
    const matchedData = this.statefetchedDatadaily.find((data: any) => data.statedailyid === id );
    return matchedData || null;
  }
  findMatchingDatasubdiv(id: string): any | null {
    const matchedData = this.subdivisionfetchedDatadaily.find((data: any) => data.subdivdailyid === id);
    return matchedData || null;
  }
  findMatchingDataregion(id: string): any | null {
    const matchedData = this.regionfetchedDatadaily.find((data: any) => data.regiondailyid === id);
    return matchedData || null;
  }
  processedData: any[] = [];
  statefetchedDatadaily: any[] = [];

  subdivisionfetchedDatadaily: any[] = [];

  regionfetchedDatadaily: any[] = [];

  processFetchedDataregiondaily(): void {
    let product = 1;
    let sum = 0;
    let previousregionID = null;
      for (const item of this.fetchedData3) {
      if ( previousregionID=== item['regionid']) {
        product += item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum += item['imdarea_squarekm'];
      }
      else {
        if (previousregionID !== null) {
          this.regionfetchedDatadaily.push({
            regiondailyid: previousregionID,
            regiondailyrainfall : product/sum
          });
        }}
        product = item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum = item['imdarea_squarekm'];
      previousregionID = item['regionid'];
    }}
   processFetchedDatasubdivdaily(): void {
    let product = 1;
    let sum = 0;
    let previoussubdivId = null;
      for (const item of this.fetchedData2) {
      if ( previoussubdivId === item['subdivid']) {
        product += item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum += item['imdarea_squarekm'];
      }
      else {
        if (previoussubdivId !== null) {
          this.subdivisionfetchedDatadaily.push({
            subdivdailyid: previoussubdivId,
            subdivdailyrainfall : product/sum
          });
        }
      }
        product = item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum = item['imdarea_squarekm'];

      previoussubdivId = item['subdivid'];
    }
  }
  processFetchedDatastatedaily(): void {
    let product = 1;
    let sum = 0;
    let previousStateId = null;
      for (const item of this.fetchedData1) {
      if ( previousStateId === item['stateid']) {
        product += item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum += item['imdarea_squarekm'];
      }
      else {
        if (previousStateId !== null) {
          this.statefetchedDatadaily.push({
            statedailyid: previousStateId,
            statedailyrainfall : product/sum,
          });
        }}
        product = item['imdarea_squarekm'] * item[this.currentDateDaily];
        sum = item['imdarea_squarekm'];
      previousStateId = item['stateid'];
    }
  }

  processFetchedData(): void {
    if (this.inputValue && this.inputValue1) {
      this.processedData = [];
      for (const item of this.fetchedData) {
        this.processedData.push({ districtdailyID: item.districtid, districtdailyRainfall: item[this.inputDateDaily]});
      }}
      else {
        this.processedData = [];
      for (const item of this.fetchedData) {
        this.processedData.push({ districtdailyID: item.districtid, districtdailyRainfall: item[this.currentDateDaily]});
      }}}

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





  private loadGeoJSON(): void {
    const propertyName = this.month;
    const propertyName1 = this.day;

    // this.http.get('assets/geojson/INDIA_DISTRICT.json').subscribe((res: any) => {
    //   L.geoJSON(res, {
    //     style: (feature: any) => this.geoJSONStyle(feature, propertyName, propertyName1),
    //     onEachFeature: (feature: any, layer: any) => {
    //       const id = feature.properties[name];
    //       const id1 = feature.properties[propertyName + propertyName1];
    //       const id2 = feature.properties['object_id'];
    //       const matchedData = this.findMatchingData(id2);
    //       if (matchedData) {
    //         feature.properties[propertyName1 + '-'+ propertyName] = matchedData.jan1;
    //       }
          // const popupContent = `
          //   <div style="background-color: white; border: 1px solid #ccc; padding: 10px; font-family: Arial, sans-serif;">
          //     <div style="color: #002467; font-weight: bold; margin-bottom: 5px; font-size: 10px;">NAME: ${id}</div>
          //     <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICTID: ${id2}</div>
          //     <div style="color: #002467; font-weight: bold; font-size: 10px;">NORMAL: ${id1}</div>
          //   </div>
          // `;
          // layer.bindPopup(popupContent);
    //       layer.on('mouseover', () => {
    //         layer.openPopup();
    //       });
    //       layer.on('mouseout', () => {
    //         layer.closePopup();
    //       });
    //     },
    //   }).addTo(this.map);

    //     });
    const name = 'name';
    this.http.get('assets/geojson/INDIA_DISTRICT.json').subscribe((res: any) => {
      L.geoJSON(res, {
        style: (feature: any) => {
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingData(id2);
          const rainfall = matchedData ? matchedData.districtdailyRainfall : 0;
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
          const id1 = feature.properties['name'];
          const id2 = feature.properties['OBJECTID'];
          const matchedData = this.findMatchingData(id2);
          const rainfall = matchedData ? matchedData.districtdailyRainfall.toFixed(2) : '0.00';;
          const popupContent = `
            <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
              <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${rainfall}% </div>
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
              const rainfall = matchedData ? matchedData.statedailyrainfall: 0;
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
              const id1 = feature.properties['name'];
              const id2 = feature.properties['OBJECTID'];
              const matchedData = this.findMatchingDatastate(id2);
              const rainfall = matchedData ? matchedData.statedailyrainfall.toFixed(2) : '0.00';
              const popupContent = `
                <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
                  <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
                  <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${rainfall}% </div>
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
            const rainfall = matchedData ? matchedData.subdivdailyrainfall : 0;
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
            const id1 = feature.properties['name'];
            const id2 = feature.properties['OBJECTID'];
            const matchedData = this.findMatchingDatasubdiv(id2);
            const rainfall = matchedData ? matchedData.subdivdailyrainfall.toFixed(2) : '0.00';;
            const popupContent = `
              <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
                <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
                <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${rainfall}% </div>
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
        L.geoJSON(res, {
          style: (feature: any) => {
            const id2 = feature.properties['OBJECTID'];
            const matchedData = this.findMatchingDataregion(id2);
            const rainfall = matchedData ? matchedData.regiondailyrainfall : 0;
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
            const id1 = feature.properties['name'];
            const id2 = feature.properties['OBJECTID'];
            const matchedData = this.findMatchingDataregion(id2);
            const rainfall = matchedData ? matchedData.regiondailyrainfall.toFixed(2) : '0.00';;
            const popupContent = `
              <div style="background-color: white; padding: 5px; font-family: Arial, sans-serif;">
                <div style="color: #002467; font-weight: bold; font-size: 10px;">DISTRICT: ${id1}</div>
                <div style="color: #002467; font-weight: bold; font-size: 10px;">DAILY RAINFALL: ${rainfall}% </div>
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
        }).addTo(this.map3);
      });
  }
  getColorForRainfall(rainfall: number): string {
    const numericId = rainfall;

    if (numericId>=60) {
      return '#0096ff';
    }
    if (numericId>=20 && numericId<=59) {
      return '#32c0f8';
    }
    if (numericId >=-19 && numericId <=19 ) {
      return '#00cd5b';
    }
    if (numericId >= -59 && numericId <= -20) {
      return '#ff2700';
    }
    if (numericId >= -99 && numericId <= -60) {
      return '#ffff20';
    }
    if (numericId <= -100 ) {
      return '#ffffff';
    }
    else {
      return '#c0c0c0';
    }
  }


  loadGeoJSON1(): void {
    if (this.inputValue && this.inputValue1) {
      const propertyName = this.inputValue;
      const propertyName1 = this.inputValue1;
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
          }).addTo(this.map);
        });
        this.http.get('assets/geojson/INDIA_STATE.json').subscribe((res: any) => {
          L.geoJSON(res, {
            style: (feature: any) => this.geoJSONStyle2(feature, propertyName, propertyName1),
            onEachFeature: (feature: any, layer: any) => {
              const id = feature.properties[name];
              const id1 = feature.properties[propertyName + propertyName1 ];
              layer.bindPopup(`STATE: ${id} <br> NORMAL: ${id1}`);
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
            style: (feature: any) => this.geoJSONStyle3(feature, propertyName, propertyName1),
            onEachFeature: (feature: any, layer: any) => {
              const id = feature.properties[name];
              const id1 = feature.properties[propertyName + '-' + propertyName1 ];
              layer.bindPopup(`SUB_DIVISION: ${id} <br> NORMAL: ${id1}`);
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
          L.geoJSON(res, {
            style: (feature: any) => this.geoJSONStyle2(feature, propertyName, propertyName1),
            onEachFeature: (feature: any, layer: any) => {
              const id = feature.properties[name];
              const id1 = feature.properties[propertyName + propertyName1 ];
              layer.bindPopup(`REGION: ${id} <br> NORMAL: ${id1}`);
              layer.on('mouseover', () => {
                layer.openPopup();
              });
              layer.on('mouseout', () => {
                layer.closePopup();
              });
            }
          }).addTo(this.map3);
        });
    }
  }

  private geoJSONStyle2(feature: any, propertyName: string, propertyName1: string) {

    const id = feature.properties[propertyName + propertyName1];

    return {

      fillColor: this.getColorById(id),
      weight: 0.5,
      fillOpacity: 2
    };
  }
  private geoJSONStyle3(feature: any, propertyName: string, propertyName1: string) {
    const id = feature.properties[propertyName + '_' + propertyName1];

    return {
      fillColor: this.getColorById(id),
      weight: 0.5,
      fillOpacity: 2
    };
  }

  private getColorById(id: string): string {
    const numericId = parseInt(id);

    if (numericId < 250) {
      return '#808080';
    }
    if (numericId >= 250 && numericId <= 500) {
      return '#ffff1f';
    }
    if (numericId > 500 && numericId <= 1000) {
      return '#ff5a00';
    }
    if (numericId > 1000 && numericId <= 2000) {
      return '#00cf30';
    }
    if (numericId > 2000 && numericId <= 3000) {
      return '#c300e9';
    }
    else {
      return '#00cfff';
    }
  }

  downloadMapImage(): void {
    html2canvas(document.getElementById('map') as HTMLElement).then(canvas => {
      const link = document.createElement('a');
      link.download = 'district_normal.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
  downloadMapImage1(): void {
    html2canvas(document.getElementById('map1') as HTMLElement).then(canvas => {
      const link = document.createElement('a');
      link.download = 'state_normal.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
  downloadMapImage2(): void {
    html2canvas(document.getElementById('map2') as HTMLElement).then(canvas => {
      const link = document.createElement('a');
      link.download = 'sub-division_normal.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
  downloadMapImage3(): void {
    html2canvas(document.getElementById('map3') as HTMLElement, {
      scrollX: 0,
      scrollY: 0
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'region_normal.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

}
