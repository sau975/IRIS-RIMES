import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapContainerComponent } from './map-container/map-container.component';
import * as L from 'leaflet';
import 'leaflet-fullscreen';
import { HttpClientModule } from '@angular/common/http';
import { DepartureMapComponent } from './departure-map/departure-map.component';
import { NormalMapComponent } from './normal-map/normal-map.component';
import { DailyMapComponent } from './daily-map/daily-map.component';


@NgModule({
  declarations: [

    AppComponent,
    HeaderComponent,
    NavbarComponent,
    FrontPageComponent,
    MapContainerComponent,
    DepartureMapComponent,
    NormalMapComponent,
    DailyMapComponent,
  ],
  imports: [
    HttpClientModule,
    LeafletModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
