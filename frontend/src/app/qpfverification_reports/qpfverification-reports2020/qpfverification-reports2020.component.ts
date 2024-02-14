import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-qpfverification-reports2020',
  templateUrl: './qpfverification-reports2020.component.html',
  styleUrls: ['./qpfverification-reports2020.component.css']
})
export class QpfverificationReports2020Component implements OnInit {
  pdfSrc: string | ArrayBuffer = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadPdf();
  }

  loadPdf() {
    const pdfUrl = '/assets/pdfs/QPFVerificationReport2020.pdf';
    this.http.get(pdfUrl, { responseType: 'blob' })
      .pipe(
        map((blob: Blob) => {
          return URL.createObjectURL(blob);
        })
      )
      .subscribe((pdfUrl: string) => {
        this.pdfSrc = pdfUrl;
      });
  }
}
