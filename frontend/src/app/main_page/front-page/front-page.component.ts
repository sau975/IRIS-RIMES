import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { DataService } from '../../data.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent {
  inputValue: string = '';
  inputValue1: string = '';
  constructor(private http: HttpClient, private dataService: DataService, private router: Router) {
  }
  ngOnInit(): void {
  }
  getNormalMap(){
    this.router.navigate(['front-page/normal']);
  }
  getDailyMap(){
    this.router.navigate(['front-page/daily']);
  }

  getDepartureMap(){
    this.router.navigate(['front-page/departure']);
  }

}
