import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-defined-email-group',
  templateUrl: './defined-email-group.component.html',
  styleUrls: ['./defined-email-group.component.css']
})
export class DefinedEmailGroupComponent implements OnInit {
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
  emailGroups: any[] = [];
  idOfEditedItem: number | undefined = undefined;
  showEditPopup: boolean = false;
  editGroupData: any = {
    groupName: '',
    emails: '',
  };

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
      console.log(res)
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
    this.email = '';
  }

  open(){
    this.showPopup = true;
  }

  createEmailGroup() {

   if (this.emailGroups.some(group => group.groupname.toLowerCase() === this.groupName.toLowerCase())) {
     alert("Group Name already exists. Choose other name");
      return;
    }
    
    let data = {
      groupName: this.groupName,
      emails: JSON.stringify(this.emails)
    }

    this.dataService.createEmailGroup(data).subscribe(res => {
      alert("Email Group Created Successfully")
    })
    
    this.dataService.getEmailGroup().subscribe(res => {
      this.emailGroups = res;
    })

    this.showPopup = false;
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

  updateData() {
    console.log("update data in grp", this.editGroupData)

      if (this.idOfEditedItem === undefined) {
        console.error('idOfEditedItem is undefined');
        return;
       }

    this.dataService.upddateDataEmailgroup(this.idOfEditedItem, this.editGroupData).subscribe(
      response => {
        console.log('Update successful', response);
        // Handle successful update (e.g., navigate to another page or show a success message)
      },
      error => {
        console.error('Update failed', error);
        // Handle error
      }
    );
    this.showEditPopup = false;
  }

    cancelEdit() {
    // this.editGroupData = {
    //   stationname: this.editGroupData.stationname,
    //   stationid: this.editGroupData.stationid,
    //   editIndex: this.editGroupData.editIndex,
    //   previousstationid: this.editGroupData.previousstationid
    // };
    this.showEditPopup = false;
  }

  editGroup(station: any) {
    console.log(station)
    this.idOfEditedItem = station.id;
    this.showEditPopup = true;
    console.log(this.showEditPopup)
    console.log(this.editGroupData, 'before')
    this.editGroupData.groupName = station.groupname;
    this.editGroupData.emails = station.emails;
    console.log(this.editGroupData, 'after')
  }

  deleteGroup(id: number): void {
       this.dataService.deleteEntry(id).subscribe(() => {
         this.emailGroups = this.emailGroups.filter((item) => item.id != id);
    });
  }
}
