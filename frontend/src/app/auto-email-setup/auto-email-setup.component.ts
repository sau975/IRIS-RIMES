import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-auto-email-setup',
  templateUrl: './auto-email-setup.component.html',
  styleUrls: ['./auto-email-setup.component.css']
})
export class AutoEmailSetupComponent implements OnInit {
  autoEmailOnOff: boolean = false;
  sendTo:string = '';
  sendToGroup:string = '';
  to:string = '';
  subject:string = '';
  message:string = '';
  showPopup:boolean = false;
  emailLogs:any[]=[];
  groupName:string = '';
  email:string = '';
  emails:any[]=[];
  emailGroups:any[]=[];

  constructor(
    private dataService: DataService
  ){
    this.autoEmailOnOff = JSON.parse(localStorage.getItem('autoEmail') as any);
  }

  ngOnInit(): void {
    this.dataService.emailLog().subscribe(res => {
      this.emailLogs = res;
    })
    this.dataService.getEmailGroup().subscribe(res => {
      this.emailGroups = res;
    })
  }

  goBack() {
    window.history.back();
  }

  cancel(){
    this.showPopup = false;
  }

  addEmail(){
    this.emails.push(this.email);
  }

  open(){
    this.showPopup = true;
  }

  createEmailGroup(){
    let data = {
      groupName: this.groupName,
      emails: JSON.stringify(this.emails)
    }

    console.log(data, "pppppppp")
    this.dataService.createEmailGroup(data).subscribe(res => {
      alert("Email Group Created Successfully")
    })
  }

  setAutoEmail(){
    localStorage.setItem('autoEmail', JSON.stringify(this.autoEmailOnOff));
    if(this.autoEmailOnOff == true){
      alert("Auto email turned On")
    }else{
      alert("Auto email turned Off")
    }
  }

  send(){
    let allToEmails:any[]=[];
    if(this.sendToGroup){
      allToEmails = JSON.parse(this.sendToGroup);
    }else{
      allToEmails.push(this.to);
    }
    allToEmails.forEach(email =>{
      let data = {
        to: email,
        subject: this.subject,
        text: this.message
      }
      this.dataService.sendEmail(data).subscribe(res => {
        // alert("Email Sent");
      })
    })
  }

}
