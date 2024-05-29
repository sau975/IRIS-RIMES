import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {
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
  attachments: any[] = [];
  selectedFile: File | null = null;
  selectedSection: string = 'Select Section';
  @ViewChild('fileInput') fileInput!: ElementRef;


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

send() {
  let allToEmails: any[] = [];
  if (this.sendToGroup) {
    allToEmails = JSON.parse(this.sendToGroup);
  } else {
    allToEmails.push(this.to);
  }

  // Retrieve the base64 string file from localStorage
  let fileBase64 = localStorage.getItem("base64Stringfile");
  let filename = localStorage.getItem("filename");

  allToEmails.forEach(email => {
    let data = {
      to: email,
      subject: this.subject,
      text: this.message,
      attachments: [{
        filename: filename,
        content: fileBase64,
        encoding: 'base64'
      }]
    };

    this.dataService.sendEmail(data).subscribe(res => {
      console.log("Email sent to:", email);
    });
  });
}

 onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
  if (this.selectedFile) {
    var maxSize = 1024 * 1024; // 1 MB
    if (this.selectedFile.size > maxSize) {
      alert('File size exceeds the allowed limit. Please choose a smaller file.');
      this.clearFileInput();
      return;
    }
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const dataUri = event.target.result;
      // Store the base64 string and filename in localStorage
      localStorage.setItem("base64Stringfile", dataUri.split(',')[1]); // Split to remove the Data URI prefix
       localStorage.setItem("filename", this.selectedFile?.name ?? 'unknown');
    };
    reader.readAsDataURL(this.selectedFile); // Use readAsDataURL to get the base64 string
  }
}

  clearFileInput(): void {
    // Reset the value of the file input element
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

}
