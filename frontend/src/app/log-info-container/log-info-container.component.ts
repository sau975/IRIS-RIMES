import { Component } from '@angular/core';

@Component({
  selector: 'app-log-info-container',
  templateUrl: './log-info-container.component.html',
  styleUrls: ['./log-info-container.component.css']
})
export class LogInfoContainerComponent {

  goBack() {
    window.history.back();
  }

}
