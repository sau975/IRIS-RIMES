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

    // // Ensure the input is a valid Date object
    // const currentDate = new Date(); // You can pass any date you want
    // if (!(currentDate instanceof Date)) {
    //   throw new Error('Invalid date');
    // }

    // // Subtract 7 days to get the previous week
    // const previousWeekDate = new Date(currentDate);
    // previousWeekDate.setDate(currentDate.getDate() - 7);

    // // Get the current day of the week for the previous week
    // const currentDay = previousWeekDate.getDay();

    // // Calculate the difference between the current day and Thursday (4)
    // const daysUntilThursday = (4 - currentDay + 7) % 7;

    // // Calculate the start date of the previous weekly range (Thursday of the previous week)
    // const startDate = new Date(previousWeekDate);
    // startDate.setDate(previousWeekDate.getDate() + daysUntilThursday);

    // // Calculate the end date of the previous weekly range (Wednesday of the current week)
    // const endDate = new Date(startDate);
    // endDate.setDate(startDate.getDate() + 6);

    // return {
    //   start: startDate,
    //   end: endDate
    // };
  }
}
