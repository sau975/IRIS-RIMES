import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NormalMapComponent } from './normal-map/normal-map.component';
import { DepartureMapComponent } from './departure-map/departure-map.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { DailyMapComponent } from './daily-map/daily-map.component';

const routes: Routes = [
  { path: '', component: FrontPageComponent, children: [
    { path: 'departure', component: DepartureMapComponent },
    { path: 'normal', component: NormalMapComponent },
    { path: 'daily', component: DailyMapComponent },
    { path: '', redirectTo: 'departure', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
