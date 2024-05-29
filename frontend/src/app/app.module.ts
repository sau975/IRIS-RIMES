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
import { AboutComponent } from './about/about.component';
import { VerificationPageComponent } from './verification-page/verification-page.component';
import { DeletedStationLogComponent } from './deleted-station-log/deleted-station-log.component';
import { LastFiveYearDataComponent } from './last-five-year-data/last-five-year-data.component';
import { StationStatisticsComponent } from './station-statistics/station-statistics.component';
import { MatMenuModule} from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'
import { ChartModule } from 'angular-highcharts';
import { MultiSelectDropdownComponent } from './multi-select-dropdown/multi-select-dropdown.component';
import { YearlyStationStatisticsComponent } from './yearly-station-statistics/yearly-station-statistics.component';
import { EmailDisseminationComponent } from './email-dissemination/email-dissemination.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RealtimeStationDataComponent } from './realtime-station-data/realtime-station-data.component';
import { LogInfoContainerComponent } from './log-info-container/log-info-container.component';
import { LogInfoForReportsComponent } from './log-info-for-reports/log-info-for-reports.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { SendEmailComponent } from './send-email/send-email.component';
import { AutoEmailSetupComponent } from './auto-email-setup/auto-email-setup.component';
import { DefinedEmailGroupComponent } from './defined-email-group/defined-email-group.component';
import { EmailLogComponent } from './email-log/email-log.component';
import { StatewiseDistRainfallComponent } from './statewise-dist-rainfall/statewise-dist-rainfall.component';
import { VerificationPageMcComponent } from './verification-page-mc/verification-page-mc.component';
import { RainfallgraphsComponent } from './rainfall-graphs/rainfallgraphs/rainfallgraphs.component';
import { RainfallGraphsWinterPanindiaComponent } from './rainfall-graphs/winter/rainfall-graphs-winter-panindia/rainfall-graphs-winter-panindia.component';
import { RainfallGraphsWinterNorthwestregionComponent } from './rainfall-graphs/winter/rainfall-graphs-winter-northwestregion/rainfall-graphs-winter-northwestregion.component';
import { RainfallGraphsWinterEastandnortheastregionComponent } from './rainfall-graphs/winter/rainfall-graphs-winter-eastandnortheastregion/rainfall-graphs-winter-eastandnortheastregion.component';
import { RainfallGraphsWinterSouthpeninsularregionComponent } from './rainfall-graphs/winter/rainfall-graphs-winter-southpeninsularregion/rainfall-graphs-winter-southpeninsularregion.component';
import { RainfallGraphsWinterCentralindiaregionComponent } from './rainfall-graphs/winter/rainfall-graphs-winter-centralindiaregion/rainfall-graphs-winter-centralindiaregion.component';
import { RainfallGraphsPremonsoonCentralindiaregionComponent } from './rainfall-graphs/pre-monsoon/rainfall-graphs-premonsoon-centralindiaregion/rainfall-graphs-premonsoon-centralindiaregion.component';
import { RainfallGraphsPremonsoonPanindiaComponent } from './rainfall-graphs/pre-monsoon/rainfall-graphs-premonsoon-panindia/rainfall-graphs-premonsoon-panindia.component';
import { RainfallGraphsPremonsoonEastandnortheastregionComponent } from './rainfall-graphs/pre-monsoon/rainfall-graphs-premonsoon-eastandnortheastregion/rainfall-graphs-premonsoon-eastandnortheastregion.component';
import { RainfallGraphsPremonsoonSouthpeninsularregionComponent } from './rainfall-graphs/pre-monsoon/rainfall-graphs-premonsoon-southpeninsularregion/rainfall-graphs-premonsoon-southpeninsularregion.component';
import { RainfallGraphsPremonsoonNorthwestregionComponent } from './rainfall-graphs/pre-monsoon/rainfall-graphs-premonsoon-northwestregion/rainfall-graphs-premonsoon-northwestregion.component';
import { RainfallGraphsMonsoonCentralindiaregionComponent } from './rainfall-graphs/monsoon/rainfall-graphs-monsoon-centralindiaregion/rainfall-graphs-monsoon-centralindiaregion.component';
import { RainfallGraphsMonsoonEastandnortheastregionComponent } from './rainfall-graphs/monsoon/rainfall-graphs-monsoon-eastandnortheastregion/rainfall-graphs-monsoon-eastandnortheastregion.component';
import { RainfallGraphsMonsoonNorthwestregionComponent } from './rainfall-graphs/monsoon/rainfall-graphs-monsoon-northwestregion/rainfall-graphs-monsoon-northwestregion.component';
import { RainfallGraphsMonsoonPanindiaComponent } from './rainfall-graphs/monsoon/rainfall-graphs-monsoon-panindia/rainfall-graphs-monsoon-panindia.component';
import { RainfallGraphsMonsoonSouthpeninsularregionComponent } from './rainfall-graphs/monsoon/rainfall-graphs-monsoon-southpeninsularregion/rainfall-graphs-monsoon-southpeninsularregion.component';
import { RainfallGraphsPostmonsoonCentralindiaregionComponent } from './rainfall-graphs/post-monsoon/rainfall-graphs-postmonsoon-centralindiaregion/rainfall-graphs-postmonsoon-centralindiaregion.component';
import { RainfallGraphsPostmonsoonPanindiaComponent } from './rainfall-graphs/post-monsoon/rainfall-graphs-postmonsoon-panindia/rainfall-graphs-postmonsoon-panindia.component';
import { RainfallGraphsPostmonsoonEastandnortheastregionComponent } from './rainfall-graphs/post-monsoon/rainfall-graphs-postmonsoon-eastandnortheastregion/rainfall-graphs-postmonsoon-eastandnortheastregion.component';
import { RainfallGraphsPostmonsoonSouthpeninsularregionComponent } from './rainfall-graphs/post-monsoon/rainfall-graphs-postmonsoon-southpeninsularregion/rainfall-graphs-postmonsoon-southpeninsularregion.component';
import { RainfallGraphsPostmonsoonNorthwestregionComponent } from './rainfall-graphs/post-monsoon/rainfall-graphs-postmonsoon-northwestregion/rainfall-graphs-postmonsoon-northwestregion.component';
import { VerificationPageHQComponent } from './verification-page-hq/verification-page-hq.component';
import { StateWiseComponent } from './state-wise/state-wise.component';
import { RainfallDataCmComponent } from './rainfall-data-cm/rainfall-data-cm.component';

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
    QpfverificationReports2022Component,
    UploadFileComponent,
    AboutComponent,
    VerificationPageComponent,
    DeletedStationLogComponent,
    LastFiveYearDataComponent,
    StationStatisticsComponent,
    MultiSelectDropdownComponent,
    YearlyStationStatisticsComponent,
    EmailDisseminationComponent,
    RealtimeStationDataComponent,
    LogInfoContainerComponent,
    LogInfoForReportsComponent,
    StatewiseDistRainfallComponent,
    RainfallgraphsComponent,
    RainfallGraphsWinterPanindiaComponent,
    RainfallGraphsWinterNorthwestregionComponent,
    RainfallGraphsWinterEastandnortheastregionComponent,
    RainfallGraphsWinterSouthpeninsularregionComponent,
    RainfallGraphsWinterCentralindiaregionComponent,
    RainfallGraphsPremonsoonCentralindiaregionComponent,
    RainfallGraphsPremonsoonPanindiaComponent,
    RainfallGraphsPremonsoonEastandnortheastregionComponent,
    RainfallGraphsPremonsoonSouthpeninsularregionComponent,
    RainfallGraphsPremonsoonNorthwestregionComponent,
    RainfallGraphsMonsoonCentralindiaregionComponent,
    RainfallGraphsMonsoonEastandnortheastregionComponent,
    RainfallGraphsMonsoonNorthwestregionComponent,
    RainfallGraphsMonsoonPanindiaComponent,
    RainfallGraphsMonsoonSouthpeninsularregionComponent,
    RainfallGraphsPostmonsoonCentralindiaregionComponent,
    RainfallGraphsPostmonsoonPanindiaComponent,
    RainfallGraphsPostmonsoonEastandnortheastregionComponent,
    RainfallGraphsPostmonsoonSouthpeninsularregionComponent,
    RainfallGraphsPostmonsoonNorthwestregionComponent,
    SendEmailComponent,
    AutoEmailSetupComponent,
    DefinedEmailGroupComponent,
    EmailLogComponent,
    StatewiseDistRainfallComponent,
    VerificationPageMcComponent,
    VerificationPageHQComponent,
    StateWiseComponent,
    RainfallDataCmComponent
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
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ChartModule,
    MatTabsModule,
    MultiSelectModule
  ],
  providers: [AuthGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
