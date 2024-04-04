import { Component } from '@angular/core';

@Component({
  selector: 'app-email-dissemination',
  templateUrl: './email-dissemination.component.html',
  styleUrls: ['./email-dissemination.component.css']
})
export class EmailDisseminationComponent {

  goBack() {
    window.history.back();
  }

}
