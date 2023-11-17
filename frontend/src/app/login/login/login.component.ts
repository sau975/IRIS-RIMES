import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string | undefined;
  password: string | undefined;

  users = [
    {id: 101, username: "rimes@int", password: "123"},
    {id: 102, username: "pawan@int", password: "123"},
    {id: 103, username: "saurav@int", password: "123"}
  ];

  constructor(private router: Router) { }

  login() {
    let isAuthorised = this.users.find(x => x.username == this.username && x.password == this.password);
    if(isAuthorised){
      this.router.navigate(['/front-page']);
    }else{
      alert("Username and Passwrod are Invalid")
    }
  }

}
