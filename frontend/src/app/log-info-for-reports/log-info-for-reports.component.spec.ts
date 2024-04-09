import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInfoForReportsComponent } from './log-info-for-reports.component';

describe('LogInfoForReportsComponent', () => {
  let component: LogInfoForReportsComponent;
  let fixture: ComponentFixture<LogInfoForReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogInfoForReportsComponent]
    });
    fixture = TestBed.createComponent(LogInfoForReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
