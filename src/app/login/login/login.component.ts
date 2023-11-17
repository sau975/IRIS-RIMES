import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string | undefined;
  password: string| undefined;

  constructor(private router: Router) { }

  login() {
    this.router.navigate(['/front-page']);
  }

}
