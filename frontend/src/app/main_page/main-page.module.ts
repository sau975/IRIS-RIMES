import { NgModule } from "@angular/core";
import { DailyMapComponent } from "./daily-map/daily-map.component";
import { DepartureMapComponent } from "./departure-map/departure-map.component";
import { FrontPageComponent } from "./front-page/front-page.component";
import { NormalMapComponent } from "./normal-map/normal-map.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "./header/header.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { AuthGuard } from "../auth-guard";
import { CommonModule } from '@angular/common';
import { DataentryComponent } from './dataentry/dataentry.component';

const routes: Routes = [
    { path: '', component: FrontPageComponent, canActivate: [AuthGuard], children: [
        { path: 'departure', component: DepartureMapComponent },
        { path: 'normal', component: NormalMapComponent },
        { path: 'daily', component: DailyMapComponent },
        { path: '', redirectTo: 'departure', pathMatch: 'full' }
  ]},
];

@NgModule({
    declarations: [
        FrontPageComponent,
        DepartureMapComponent,
        NormalMapComponent,
        DailyMapComponent,
        HeaderComponent,
        NavbarComponent,
        DataentryComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class MainPageModule { }
