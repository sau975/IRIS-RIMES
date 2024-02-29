import { Component } from '@angular/core';

@Component({
  selector: 'app-last-five-year-data',
  templateUrl: './last-five-year-data.component.html',
  styleUrls: ['./last-five-year-data.component.css']
})
export class LastFiveYearDataComponent {

  goBack() {
    window.history.back();
  }

  submit(){

  }
}
