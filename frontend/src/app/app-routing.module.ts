import { LogInfoForReportsComponent } from './log-info-for-reports/log-info-for-reports.component';
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
import { AboutComponent } from './about/about.component';
import { VerificationPageComponent } from './verification-page/verification-page.component';
import { VerificationPageMcComponent } from './verification-page-mc/verification-page-mc.component';
import { DeletedStationLogComponent } from './deleted-station-log/deleted-station-log.component';
import { LastFiveYearDataComponent } from './last-five-year-data/last-five-year-data.component';
import { StationStatisticsComponent } from './station-statistics/station-statistics.component';
import { YearlyStationStatisticsComponent } from './yearly-station-statistics/yearly-station-statistics.component';
import { EmailDisseminationComponent } from './email-dissemination/email-dissemination.component';
import { RealtimeStationDataComponent } from './realtime-station-data/realtime-station-data.component';
import { LogInfoContainerComponent } from './log-info-container/log-info-container.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { AutoEmailSetupComponent } from './auto-email-setup/auto-email-setup.component';
import { DefinedEmailGroupComponent } from './defined-email-group/defined-email-group.component';
import { EmailLogComponent } from './email-log/email-log.component';
import { StateWiseComponent } from './state-wise/state-wise.component';
import { StatewiseDistRainfallComponent } from './statewise-dist-rainfall/statewise-dist-rainfall.component';
import { RainfallGraphsWinterPanindiaComponent } from './rainfall-graphs/winter/rainfall-graphs-winter-panindia/rainfall-graphs-winter-panindia.component';
import { RainfallGraphsWinterNorthwestregionComponent } from './rainfall-graphs/winter/rainfall-graphs-winter-northwestregion/rainfall-graphs-winter-northwestregion.component';
import { RainfallGraphsWinterEastandnortheastregionComponent } from './rainfall-graphs/winter/rainfall-graphs-winter-eastandnortheastregion/rainfall-graphs-winter-eastandnortheastregion.component';
import { RainfallGraphsWinterSouthpeninsularregionComponent } from './rainfall-graphs/winter/rainfall-graphs-winter-southpeninsularregion/rainfall-graphs-winter-southpeninsularregion.component';
import { RainfallGraphsWinterCentralindiaregionComponent } from './rainfall-graphs/winter/rainfall-graphs-winter-centralindiaregion/rainfall-graphs-winter-centralindiaregion.component';
import { RainfallGraphsPremonsoonPanindiaComponent } from './rainfall-graphs/pre-monsoon/rainfall-graphs-premonsoon-panindia/rainfall-graphs-premonsoon-panindia.component';
import { RainfallGraphsPremonsoonEastandnortheastregionComponent } from './rainfall-graphs/pre-monsoon/rainfall-graphs-premonsoon-eastandnortheastregion/rainfall-graphs-premonsoon-eastandnortheastregion.component';
import { RainfallGraphsPremonsoonNorthwestregionComponent } from './rainfall-graphs/pre-monsoon/rainfall-graphs-premonsoon-northwestregion/rainfall-graphs-premonsoon-northwestregion.component';
import { RainfallGraphsPremonsoonSouthpeninsularregionComponent } from './rainfall-graphs/pre-monsoon/rainfall-graphs-premonsoon-southpeninsularregion/rainfall-graphs-premonsoon-southpeninsularregion.component';
import { RainfallGraphsPremonsoonCentralindiaregionComponent } from './rainfall-graphs/pre-monsoon/rainfall-graphs-premonsoon-centralindiaregion/rainfall-graphs-premonsoon-centralindiaregion.component';
import { RainfallGraphsMonsoonPanindiaComponent } from './rainfall-graphs/monsoon/rainfall-graphs-monsoon-panindia/rainfall-graphs-monsoon-panindia.component';
import { RainfallGraphsMonsoonEastandnortheastregionComponent } from './rainfall-graphs/monsoon/rainfall-graphs-monsoon-eastandnortheastregion/rainfall-graphs-monsoon-eastandnortheastregion.component';
import { RainfallGraphsMonsoonNorthwestregionComponent } from './rainfall-graphs/monsoon/rainfall-graphs-monsoon-northwestregion/rainfall-graphs-monsoon-northwestregion.component';
import { RainfallGraphsMonsoonSouthpeninsularregionComponent } from './rainfall-graphs/monsoon/rainfall-graphs-monsoon-southpeninsularregion/rainfall-graphs-monsoon-southpeninsularregion.component';
import { RainfallGraphsMonsoonCentralindiaregionComponent } from './rainfall-graphs/monsoon/rainfall-graphs-monsoon-centralindiaregion/rainfall-graphs-monsoon-centralindiaregion.component';
import { RainfallGraphsPostmonsoonPanindiaComponent } from './rainfall-graphs/post-monsoon/rainfall-graphs-postmonsoon-panindia/rainfall-graphs-postmonsoon-panindia.component';
import { RainfallGraphsPostmonsoonEastandnortheastregionComponent } from './rainfall-graphs/post-monsoon/rainfall-graphs-postmonsoon-eastandnortheastregion/rainfall-graphs-postmonsoon-eastandnortheastregion.component';
import { RainfallGraphsPostmonsoonNorthwestregionComponent } from './rainfall-graphs/post-monsoon/rainfall-graphs-postmonsoon-northwestregion/rainfall-graphs-postmonsoon-northwestregion.component';
import { RainfallGraphsPostmonsoonSouthpeninsularregionComponent } from './rainfall-graphs/post-monsoon/rainfall-graphs-postmonsoon-southpeninsularregion/rainfall-graphs-postmonsoon-southpeninsularregion.component';
import { RainfallGraphsPostmonsoonCentralindiaregionComponent } from './rainfall-graphs/post-monsoon/rainfall-graphs-postmonsoon-centralindiaregion/rainfall-graphs-postmonsoon-centralindiaregion.component';
import { VerificationPageHQComponent } from './verification-page-hq/verification-page-hq.component';
import { RainfallDataCmComponent } from './rainfall-data-cm/rainfall-data-cm.component';

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

  { path: 'rainfallgraphs-winter-panindia', component: RainfallGraphsWinterPanindiaComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-winter-eastandnortheastregion', component: RainfallGraphsWinterEastandnortheastregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-winter-northwestregion', component: RainfallGraphsWinterNorthwestregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-winter-southpeninsularregion', component: RainfallGraphsWinterSouthpeninsularregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-winter-centralindiaregion', component: RainfallGraphsWinterCentralindiaregionComponent, canActivate: [AuthGuard]},

  { path: 'rainfallgraphs-premonsoon-panindia', component: RainfallGraphsPremonsoonPanindiaComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-premonsoon-eastandnortheastregion', component: RainfallGraphsPremonsoonEastandnortheastregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-premonsoon-northwestregion', component: RainfallGraphsPremonsoonNorthwestregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-premonsoon-southpeninsularregion', component: RainfallGraphsPremonsoonSouthpeninsularregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-premonsoon-centralindiaregion', component: RainfallGraphsPremonsoonCentralindiaregionComponent, canActivate: [AuthGuard]},

  { path: 'rainfallgraphs-monsoon-panindia', component: RainfallGraphsMonsoonPanindiaComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-monsoon-eastandnortheastregion', component: RainfallGraphsMonsoonEastandnortheastregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-monsoon-northwestregion', component: RainfallGraphsMonsoonNorthwestregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-monsoon-southpeninsularregion', component: RainfallGraphsMonsoonSouthpeninsularregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-monsoon-centralindiaregion', component: RainfallGraphsMonsoonCentralindiaregionComponent, canActivate: [AuthGuard]},

  { path: 'rainfallgraphs-postmonsoon-panindia', component: RainfallGraphsPostmonsoonPanindiaComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-postmonsoon-eastandnortheastregion', component: RainfallGraphsPostmonsoonEastandnortheastregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-postmonsoon-northwestregion', component: RainfallGraphsPostmonsoonNorthwestregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-postmonsoon-southpeninsularregion', component: RainfallGraphsPostmonsoonSouthpeninsularregionComponent, canActivate: [AuthGuard]},
  { path: 'rainfallgraphs-postmonsoon-centralindiaregion', component: RainfallGraphsPostmonsoonCentralindiaregionComponent, canActivate: [AuthGuard]},
  { path: 'state-wise-district-rainfall', component: StateWiseComponent, canActivate: [AuthGuard]},


  { path: 'QpfverificationReports2020', component: QpfverificationReports2020Component , canActivate: [AuthGuard] },
  { path: 'QpfverificationReports2021', component: QpfverificationReports2021Component , canActivate: [AuthGuard] },
  { path: 'QpfverificationReports2022', component: QpfverificationReports2022Component , canActivate: [AuthGuard] },
  { path: 'upload-file', component: UploadFileComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'verification-page', component: VerificationPageComponent, canActivate: [AuthGuard] },
  { path: 'verification-page-mc', component: VerificationPageMcComponent, canActivate: [AuthGuard] },
  { path: 'verification-page-hq', component: VerificationPageHQComponent, canActivate: [AuthGuard] },
  { path: 'last-five-year-data', component: LastFiveYearDataComponent, canActivate: [AuthGuard] },
  {path: 'rainfall-data-cm', component: RainfallDataCmComponent, canActivate: [AuthGuard]},
  { path: 'station-statistics', component: StationStatisticsComponent, canActivate: [AuthGuard] },
  { path: 'yearly-station-statistics', component: YearlyStationStatisticsComponent, canActivate: [AuthGuard] },
  { path: 'realtime-station-data', component: RealtimeStationDataComponent, canActivate: [AuthGuard] },
  { path: 'email-dissemination', component: EmailDisseminationComponent, canActivate: [AuthGuard], children:
    [
      { path: 'send-email', component: SendEmailComponent },
      { path: 'auto-email', component: AutoEmailSetupComponent },
      { path: 'defined-email', component: DefinedEmailGroupComponent },
      { path: 'email-log', component: EmailLogComponent },
      { path: '', redirectTo: 'send-email', pathMatch: 'full' }
    ]
   },
  { path: 'log-info', component: LogInfoContainerComponent, canActivate: [AuthGuard], children:
    [
      { path: 'station-log', component: DeletedStationLogComponent },
      { path: 'reports-log', component: LogInfoForReportsComponent },
      { path: '', redirectTo: 'station-log', pathMatch: 'full' }
    ]
   },
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
