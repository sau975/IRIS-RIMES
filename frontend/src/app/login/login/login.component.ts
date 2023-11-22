import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string | undefined;
  password: string | undefined;

  constructor(
    private router: Router,
    private dataService: DataService
  ) {
   }

  login() {
    let loginData = {
      username: this.username,
      password: this.password
    }
    this.dataService.userLogin(loginData).subscribe(res => {
      console.log(res, "jjjjjj")
      if(res && res.message == "Login successful"){
        localStorage.setItem("isAuthorised", JSON.stringify(res));
        this.router.navigate(['/front-page']);
      }else{
        alert(res.message);
      }  
    })
  }

}
