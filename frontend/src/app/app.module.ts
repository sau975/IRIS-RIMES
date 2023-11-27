import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapContainerComponent } from './main_page/map-container/map-container.component';
import * as L from 'leaflet';
import 'leaflet-fullscreen';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login/login.component';
import { MainPageModule } from './main_page/main-page.module';
import { AuthGuard } from './auth-guard';
import { DataentryComponent } from './main_page/dataentry/dataentry.component';
import { TableModule } from "primeng/table";
import { PaginatorModule } from "primeng/paginator";
import { StationLevelDataComponent } from './station-level-data/station-level-data.component';


@NgModule({
  declarations: [
    AppComponent,
    MapContainerComponent,
    LoginComponent,
    DataentryComponent,
    StationLevelDataComponent
  ],
  imports: [
    HttpClientModule,
    LeafletModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MainPageModule,
    CommonModule,
    FormsModule,
    TableModule,
    // DataTableModule,
    PaginatorModule,

  ],exports: [
    TableModule,
    // DataTableModule,
    PaginatorModule,

  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
