import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weekly-departure-map',
  templateUrl: './weekly-departure-map.component.html',
  styleUrls: ['./weekly-departure-map.component.css']
})
export class WeeklyDepartureMapComponent implements OnInit {

  previousWeekWeeklyStartDate: string = '';
  previousWeekWeeklyEndDate: string = '';

  constructor(){}

  ngOnInit(): void {
    const previousWeekWeeklyRange = this.getPreviousWeekWeeklyRange();
    this.previousWeekWeeklyStartDate = previousWeekWeeklyRange.start.toISOString();
    this.previousWeekWeeklyEndDate = previousWeekWeeklyRange.end.toISOString();
    console.log("Start Date:", previousWeekWeeklyRange.start.toISOString());
    console.log("End Date:", previousWeekWeeklyRange.end.toISOString());

  }

  getPreviousWeekWeeklyRange() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate the difference between the current day and Thursday (4)
    const daysUntilThursday = (4 - currentDay + 7) % 7;

    // Calculate the start date (Thursday) and end date (Wednesday) of the previous week
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + daysUntilThursday - 7);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    // Calculate the start date (Thursday) and end date (Wednesday) of the week before the previous week
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(startDate.getDate() - 7);

    const previousEndDate = new Date(endDate);
    previousEndDate.setDate(endDate.getDate() - 7);

    return {
      start: previousStartDate,
      end: previousEndDate,
    };
  }
}
