import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormalMapComponent } from './main_page/normal-map/normal-map.component';
import { DepartureMapComponent } from './main_page/departure-map/departure-map.component';
import { FrontPageComponent } from './main_page/front-page/front-page.component';
import { DailyMapComponent } from './main_page/daily-map/daily-map.component';
import { LoginComponent } from './login/login/login.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'front', component: FrontPageComponent, children: [
    { path: 'departure', component: DepartureMapComponent },
    { path: 'normal', component: NormalMapComponent },
    { path: 'daily', component: DailyMapComponent },
    { path: '', redirectTo: 'departure', pathMatch: 'full' }
  ]},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
