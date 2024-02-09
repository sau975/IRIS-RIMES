import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWeeklySubdivisionDepartureMapComponent } from './daily-weekly-subdivision-departure-map.component';

describe('DailyWeeklySubdivisionDepartureMapComponent', () => {
  let component: DailyWeeklySubdivisionDepartureMapComponent;
  let fixture: ComponentFixture<DailyWeeklySubdivisionDepartureMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyWeeklySubdivisionDepartureMapComponent]
    });
    fixture = TestBed.createComponent(DailyWeeklySubdivisionDepartureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
