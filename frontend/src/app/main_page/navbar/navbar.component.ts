import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    private router: Router,
    private dataService: DataService
    ){}

  downloadPDF(name:string){
    localStorage.removeItem('weekDates');
    this.dataService.setdownloadPdf(name);
  }

  downloadWeeklyPDF(name:string){
    this.dataService.setweeklyPdf(name);
    this.weeklyMap();
  }

  goToDailyDepartureMap(name:string){
    localStorage.removeItem('weekDates');
    if(name == "District"){
      this.router.navigate(['daily-departure-district-map']);
    }
    if(name == "State"){
      this.router.navigate(['daily-departure-state-map']);
    }
    if(name == "SubDivision"){
      this.router.navigate(['daily-departure-subdivision-map']);
    }
    if(name == "Homogenous"){
      this.router.navigate(['daily-departure-homogenous-map']);
    }
    if(name == "Country"){
      this.router.navigate(['daily-departure-country-map']);
    }
  }

  goToDailyMap(name:string){
    if(name == "District"){
      this.router.navigate(['daily-district-map']);
    }
    if(name == "State"){
      this.router.navigate(['daily-state-map']);
    }
    if(name == "SubDivision"){
      this.router.navigate(['daily-subdivision-map']);
    }
    if(name == "Homogenous"){
      this.router.navigate(['daily-homogenous-map']);
    }
  }

  goToNormalMap(name:string){
    if(name == "District"){
      this.router.navigate(['normal-district-map']);
    }
    if(name == "State"){
      this.router.navigate(['normal-state-map']);
    }
    if(name == "SubDivision"){
      this.router.navigate(['normal-subdivision-map']);
    }
    if(name == "Homogenous"){
      this.router.navigate(['normal-homogenous-map']);
    }
  }

  goToWeeklyMap(name:string){
    this.weeklyMap();
    if(name == "District"){
      this.router.navigate(['daily-departure-district-map']);
    }
    if(name == "State"){
      this.router.navigate(['daily-departure-state-map']);
    }
    if(name == "SubDivision"){
      this.router.navigate(['daily-departure-subdivision-map']);
    }
    if(name == "Homogenous"){
      this.router.navigate(['daily-departure-homogenous-map']);
    }
    if(name == "Country"){
      this.router.navigate(['daily-departure-country-map']);
    }
  }

  weeklyMap(){
    const previousWeekWeeklyRange = this.getPreviousWeekWeeklyRange();
    let data = {
      previousWeekWeeklyStartDate: previousWeekWeeklyRange.start.toISOString(),
      previousWeekWeeklyEndDate: previousWeekWeeklyRange.end.toISOString()
    }
    localStorage.setItem('weekDates', JSON.stringify(data));
  }

  getPreviousWeekWeeklyRange() {
      // Ensure the input is a valid Date object
      const currentDate = new Date(); // You can pass any date you want
      if (!(currentDate instanceof Date)) {
        throw new Error('Invalid date');
      }

      // Subtract 7 days to get the previous week
      const previousWeekDate = new Date(currentDate);
      previousWeekDate.setDate(currentDate.getDate() - 7);

      // Get the current day of the week for the previous week
      const currentDay = previousWeekDate.getDay();

      // Calculate the difference between the current day and Thursday (4)
      const daysUntilThursday = (4 - currentDay + 7) % 7;

      // Calculate the start date of the previous weekly range (Thursday of the previous week)
      const startDate = new Date(previousWeekDate);
      startDate.setDate(previousWeekDate.getDate() + daysUntilThursday);

      // Calculate the end date of the previous weekly range (Wednesday of the current week)
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      return {
        start: startDate,
        end: endDate
      };
    }
  }
