import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QpfverificationReports2022Component } from './qpfverification-reports2022.component';

describe('QpfverificationReports2022Component', () => {
  let component: QpfverificationReports2022Component;
  let fixture: ComponentFixture<QpfverificationReports2022Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QpfverificationReports2022Component]
    });
    fixture = TestBed.createComponent(QpfverificationReports2022Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
