import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { response } from 'express';

@Component({
  selector: 'app-dataentry',
  templateUrl: './dataentry.component.html',
  styleUrls: ['./dataentry.component.css']
})
export class DataentryComponent {
  stations: any[] = [{}];
  data = {
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
  };
  message: string | null = null;

  constructor(private dataService: DataService,) {}


  addStation() {
    this.stations.push({});
  }

  addData() {
    this.dataService.addData(this.stations).subscribe({
      next: response => {
        this.message = response.message;
      },
      error: err => console.error('Error adding data. Please check the console for details.', err)

  });
  }
}


