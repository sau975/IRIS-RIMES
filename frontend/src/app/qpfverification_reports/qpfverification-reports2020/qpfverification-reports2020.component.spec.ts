import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QpfverificationReports2020Component } from './qpfverification-reports2020.component';

describe('QpfverificationReports2020Component', () => {
  let component: QpfverificationReports2020Component;
  let fixture: ComponentFixture<QpfverificationReports2020Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QpfverificationReports2020Component]
    });
    fixture = TestBed.createComponent(QpfverificationReports2020Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
