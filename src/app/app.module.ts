import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './main_page/header/header.component';
import { NavbarComponent } from './main_page/navbar/navbar.component';
import { FrontPageComponent } from './main_page/front-page/front-page.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapContainerComponent } from './main_page/map-container/map-container.component';
import * as L from 'leaflet';
import 'leaflet-fullscreen';
import { HttpClientModule } from '@angular/common/http';
import { DepartureMapComponent } from './main_page/departure-map/departure-map.component';
import { NormalMapComponent } from './main_page/normal-map/normal-map.component';
import { DailyMapComponent } from './main_page/daily-map/daily-map.component';
import { LoginComponent } from './login/login/login.component';



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
    LoginComponent
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
