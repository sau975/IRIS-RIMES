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

  selectedMenuItem: string = 'station-log'; // To store the selected menu item

  selectMenuItem(menuItem: string): void {
    this.selectedMenuItem = menuItem;
  }

  isSelected(menuItem: string): boolean {
    return this.selectedMenuItem === menuItem;
  }
}
