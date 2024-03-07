import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedInUser: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    let loggedInUser: any = localStorage.getItem("isAuthorised");
    this.loggedInUser = JSON.parse(loggedInUser);
  }

  logOut() {
    localStorage.removeItem("isAuthorised");
    this.router.navigate(['login']);
  }
}
