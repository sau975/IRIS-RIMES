import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  selectedFile: File | null = null;
  selectedSection: string = 'Select Section';
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private dataService: DataService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      var maxSize = 1024 * 1024; // 1 MB
      if (this.selectedFile.size > maxSize) {
        alert('File size exceeds the allowed limit. Please choose a smaller file.');
        this.clearFileInput();
      }
      const reader:any = new FileReader();
      reader.onload = function (e:any) {
        const base64String = btoa(reader.result);
        localStorage.setItem("base64String", base64String)
      };
      reader.readAsBinaryString(this.selectedFile);
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      let data = {
        fileName: this.selectedFile.name,
        fileData: localStorage.getItem("base64String"),
        sectionName: this.selectedSection
      }
      this.dataService
        .uploadFile(data)
        .subscribe(
          (response: any) => {
            alert('File uploaded successfully');
            let loggedInUser: any = localStorage.getItem("isAuthorised");
            let parseloggedInUser = JSON.parse(loggedInUser);
            if(this.selectedFile){
              let dataUpload = {
                stationName: this.selectedFile.name,
                stationId: '',
                dateTime: new Date(),
                userName: parseloggedInUser.data[0].name,
                type: "Report Uploaded"
              }
              this.dataService.addDeletedAndCreatedStationLogData(dataUpload).subscribe(res => {
                console.log('Log created successfully:', response);
              })
            }
            this.clearFileInput();
            localStorage.removeItem("base64String");
          },
          (error: any) => {
            alert('Error uploading file:' + error);
          }
        );
    }
  }

  clearFileInput(): void {
    // Reset the value of the file input element
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

}
