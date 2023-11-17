import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapContainerComponent } from './main_page/map-container/map-container.component';
import * as L from 'leaflet';
import 'leaflet-fullscreen';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login/login.component';
import { MainPageModule } from './main_page/main-page.module';



@NgModule({
  declarations: [
    AppComponent,
    MapContainerComponent,
    LoginComponent
  ],
  imports: [
    HttpClientModule,
    LeafletModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MainPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
