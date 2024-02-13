import { Component } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  selectedFile: File | null = null;

  constructor(private dataService: DataService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.dataService.uploadFile(this.selectedFile).subscribe(
        (response:any) => {
          alert('File uploaded successfully:' + response);
        },
        (error:any) => {
          alert('Error uploading file:' + error);
        }
      );
    }
  }
}
