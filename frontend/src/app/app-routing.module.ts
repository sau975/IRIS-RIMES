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


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'data-entry', component: DataentryComponent, canActivate: [AuthGuard] },
  { path: 'station-level-data', component: StationLevelDataComponent, canActivate: [AuthGuard] },
  { path: 'front-page', component: FrontPageComponent, canActivate: [AuthGuard], children:
    [
      { path: 'departure', component: DepartureMapComponent },
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
