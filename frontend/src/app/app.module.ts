import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapContainerComponent } from './main_page/map-container/map-container.component';
import * as L from 'leaflet';
import 'leaflet-fullscreen';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login/login.component';
import { AuthGuard } from './auth-guard';
import { DataentryComponent } from './main_page/dataentry/dataentry.component';
import { TableModule } from "primeng/table";
import { PaginatorModule } from "primeng/paginator";
import { StationLevelDataComponent } from './station-level-data/station-level-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DepartureMapComponent } from './main_page/departure-map/departure-map.component';
import { DailyMapComponent } from './main_page/daily-map/daily-map.component';
import { FrontPageComponent } from './main_page/front-page/front-page.component';
import { HeaderComponent } from './main_page/header/header.component';
import { NavbarComponent } from './main_page/navbar/navbar.component';
import { NormalMapComponent } from './main_page/normal-map/normal-map.component';
import { WeeklyDepartureMapComponent } from './main_page/weekly-departure-map/weekly-departure-map.component';

@NgModule({
  declarations: [
    AppComponent,
    MapContainerComponent,
    FrontPageComponent,
    NormalMapComponent,
    LoginComponent,
    DataentryComponent,
    StationLevelDataComponent,
    DepartureMapComponent,
    DailyMapComponent,
    HeaderComponent,
    NavbarComponent,
    WeeklyDepartureMapComponent
  ],
  imports: [
    HttpClientModule,
    LeafletModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatIconModule,
    MatInputModule,
    MatButtonToggleModule
  ],
  providers: [AuthGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
