import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { DataentryComponent } from './main_page/dataentry/dataentry.component';
import { StationLevelDataComponent } from './station-level-data/station-level-data.component';
import { FrontPageComponent } from './main_page/front-page/front-page.component';
import { AuthGuard } from './auth-guard';
import { DepartureMapComponent } from './main_page/departure-map/departure-map.component';
import { NormalMapComponent } from './main_page/normal-map/normal-map.component';
import { DailyMapComponent } from './main_page/daily-map/daily-map.component';
import { WeeklyDepartureMapComponent } from './main_page/weekly-departure-map/weekly-departure-map.component';
import { DailyWeeklyDistrictDepartureMapComponent } from './daily-weekly-district-departure-map/daily-weekly-district-departure-map.component';
import { DailyWeeklyCountryDepartureMapComponent } from './daily-weekly-country-departure-map/daily-weekly-country-departure-map.component';
import { DailyWeeklyHomogenousDepartureMapComponent } from './daily-weekly-homogenous-departure-map/daily-weekly-homogenous-departure-map.component';
import { DailyWeeklySubdivisionDepartureMapComponent } from './daily-weekly-subdivision-departure-map/daily-weekly-subdivision-departure-map.component';
import { DailyWeeklyStateDepartureMapComponent } from './daily-weekly-state-departure-map/daily-weekly-state-departure-map.component';
import { DailySubdivisionMapComponent } from './daily-subdivision-map/daily-subdivision-map.component';
import { DailyStateMapComponent } from './daily-state-map/daily-state-map.component';
import { DailyHomogenousMapComponent } from './daily-homogenous-map/daily-homogenous-map.component';
import { DailyDistrictMapComponent } from './daily-district-map/daily-district-map.component';
import { NormalDistrictMapComponent } from './normal-district-map/normal-district-map.component';
import { NormalHomogenousMapComponent } from './normal-homogenous-map/normal-homogenous-map.component';
import { NormalStateMapComponent } from './normal-state-map/normal-state-map.component';
import { NormalSubdivisionMapComponent } from './normal-subdivision-map/normal-subdivision-map.component';
import { UnderprogressComponent } from './underprogress/underprogress.component';
import { QpfverificationReports2020Component } from './qpfverification_reports/qpfverification-reports2020/qpfverification-reports2020.component';
import { QpfverificationReports2021Component } from './qpfverification_reports/qpfverification-reports2021/qpfverification-reports2021.component';
import { QpfverificationReports2022Component } from './qpfverification_reports/qpfverification-reports2022/qpfverification-reports2022.component';

import { UploadFileComponent } from './upload-file/upload-file.component';
import { VerificationPageComponent } from './verification-page/verification-page.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'data-entry', component: DataentryComponent, canActivate: [AuthGuard] },
  { path: 'station-level-data', component: StationLevelDataComponent, canActivate: [AuthGuard] },
  { path: 'daily-departure-district-map', component: DailyWeeklyDistrictDepartureMapComponent, canActivate: [AuthGuard] },
  { path: 'daily-departure-state-map', component: DailyWeeklyStateDepartureMapComponent, canActivate: [AuthGuard] },
  { path: 'daily-departure-subdivision-map', component: DailyWeeklySubdivisionDepartureMapComponent, canActivate: [AuthGuard] },
  { path: 'daily-departure-homogenous-map', component: DailyWeeklyHomogenousDepartureMapComponent, canActivate: [AuthGuard] },
  { path: 'daily-departure-country-map', component: DailyWeeklyCountryDepartureMapComponent, canActivate: [AuthGuard] },
  { path: 'daily-district-map', component: DailyDistrictMapComponent, canActivate: [AuthGuard] },
  { path: 'daily-state-map', component: DailyStateMapComponent, canActivate: [AuthGuard] },
  { path: 'daily-subdivision-map', component: DailySubdivisionMapComponent, canActivate: [AuthGuard] },
  { path: 'daily-homogenous-map', component: DailyHomogenousMapComponent, canActivate: [AuthGuard] },
  { path: 'normal-district-map', component: NormalDistrictMapComponent, canActivate: [AuthGuard] },
  { path: 'normal-state-map', component: NormalStateMapComponent, canActivate: [AuthGuard] },
  { path: 'normal-subdivision-map', component: NormalSubdivisionMapComponent, canActivate: [AuthGuard] },
  { path: 'normal-homogenous-map', component: NormalHomogenousMapComponent, canActivate: [AuthGuard] },
  { path: 'underprogress', component: UnderprogressComponent , canActivate: [AuthGuard] },
  { path: 'QpfverificationReports2020', component: QpfverificationReports2020Component , canActivate: [AuthGuard] },
  { path: 'QpfverificationReports2021', component: QpfverificationReports2021Component , canActivate: [AuthGuard] },
  { path: 'QpfverificationReports2022', component: QpfverificationReports2022Component , canActivate: [AuthGuard] },
  { path: 'upload-file', component: UploadFileComponent, canActivate: [AuthGuard] },
  { path: 'verification-page', component: VerificationPageComponent, canActivate: [AuthGuard] },
  { path: 'front-page', component: FrontPageComponent, canActivate: [AuthGuard], children:
    [
      { path: 'departure', component: DepartureMapComponent },
      { path: 'weekly-departure', component: WeeklyDepartureMapComponent },
      { path: 'normal', component: NormalMapComponent },
      { path: 'daily', component: DailyMapComponent },
      { path: '', redirectTo: 'departure', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
