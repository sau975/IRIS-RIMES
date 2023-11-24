import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { response } from 'express';

@Component({
  selector: 'app-dataentry',
  templateUrl: './dataentry.component.html',
  styleUrls: ['./dataentry.component.css']
})
export class DataentryComponent {

  data = {
    field1: '',
    field2: '',
  };
  message: string | null = null;

  constructor(private dataService: DataService,) {}

  addData() {

    this.dataService.addData(this.data).subscribe({
      next: response => {
        this.message = response.message;
      },
      error: err => console.error('Error adding data. Please check the console for details.', err)

  });
  }
}


