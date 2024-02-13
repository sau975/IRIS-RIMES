import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QpfverificationReports2021Component } from './qpfverification-reports2021.component';

describe('QpfverificationReports2021Component', () => {
  let component: QpfverificationReports2021Component;
  let fixture: ComponentFixture<QpfverificationReports2021Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QpfverificationReports2021Component]
    });
    fixture = TestBed.createComponent(QpfverificationReports2021Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
