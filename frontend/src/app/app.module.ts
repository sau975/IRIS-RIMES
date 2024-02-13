import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapContainerComponent } from './main_page/map-container/map-container.component';
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
import { DailyWeeklyDistrictDepartureMapComponent } from './daily-weekly-district-departure-map/daily-weekly-district-departure-map.component';
import { DailyWeeklyStateDepartureMapComponent } from './daily-weekly-state-departure-map/daily-weekly-state-departure-map.component';
import { DailyWeeklyCountryDepartureMapComponent } from './daily-weekly-country-departure-map/daily-weekly-country-departure-map.component';
import { DailyWeeklyHomogenousDepartureMapComponent } from './daily-weekly-homogenous-departure-map/daily-weekly-homogenous-departure-map.component';
import { DailyWeeklySubdivisionDepartureMapComponent } from './daily-weekly-subdivision-departure-map/daily-weekly-subdivision-departure-map.component';
import { DailySubdivisionMapComponent } from './daily-subdivision-map/daily-subdivision-map.component';
import { DailyDistrictMapComponent } from './daily-district-map/daily-district-map.component';
import { DailyStateMapComponent } from './daily-state-map/daily-state-map.component';
import { DailyHomogenousMapComponent } from './daily-homogenous-map/daily-homogenous-map.component';
import { NormalHomogenousMapComponent } from './normal-homogenous-map/normal-homogenous-map.component';
import { NormalStateMapComponent } from './normal-state-map/normal-state-map.component';
import { NormalDistrictMapComponent } from './normal-district-map/normal-district-map.component';
import { NormalSubdivisionMapComponent } from './normal-subdivision-map/normal-subdivision-map.component';
import { UnderprogressComponent } from './underprogress/underprogress.component';
import { QpfverificationReports2020Component } from './qpfverification_reports/qpfverification-reports2020/qpfverification-reports2020.component';
import { QpfverificationReports2021Component } from './qpfverification_reports/qpfverification-reports2021/qpfverification-reports2021.component';
import { QpfverificationReports2022Component } from './qpfverification_reports/qpfverification-reports2022/qpfverification-reports2022.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
 
import { UploadFileComponent } from './upload-file/upload-file.component';

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
    WeeklyDepartureMapComponent,
    DailyWeeklyDistrictDepartureMapComponent,
    DailyWeeklyStateDepartureMapComponent,
    DailyWeeklyCountryDepartureMapComponent,
    DailyWeeklyHomogenousDepartureMapComponent,
    DailyWeeklySubdivisionDepartureMapComponent,
    DailySubdivisionMapComponent,
    DailyDistrictMapComponent,
    DailyStateMapComponent,
    DailyHomogenousMapComponent,
    NormalHomogenousMapComponent,
    NormalStateMapComponent,
    NormalDistrictMapComponent,
    NormalSubdivisionMapComponent,
    UnderprogressComponent,
    QpfverificationReports2020Component,
    QpfverificationReports2021Component,
    QpfverificationReports2022Component
    UploadFileComponent
  ],
  imports: [
    PdfViewerModule,
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
    MatButtonToggleModule,
    
  ],
  providers: [AuthGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
