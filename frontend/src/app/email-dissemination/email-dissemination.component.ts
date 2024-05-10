import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-dissemination',
  templateUrl: './email-dissemination.component.html',
  styleUrls: ['./email-dissemination.component.css']
})
export class EmailDisseminationComponent implements OnInit {
  selectedMenuItem: string = 'send-email'; // To store the selected menu item

  constructor(){}

  ngOnInit(): void {}

  selectMenuItem(menuItem: string): void {
    this.selectedMenuItem = menuItem;
  }

  isSelected(menuItem: string): boolean {
    return this.selectedMenuItem === menuItem;
  }

}
