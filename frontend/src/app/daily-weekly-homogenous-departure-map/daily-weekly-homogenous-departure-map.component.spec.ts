import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWeeklyHomogenousDepartureMapComponent } from './daily-weekly-homogenous-departure-map.component';

describe('DailyWeeklyHomogenousDepartureMapComponent', () => {
  let component: DailyWeeklyHomogenousDepartureMapComponent;
  let fixture: ComponentFixture<DailyWeeklyHomogenousDepartureMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyWeeklyHomogenousDepartureMapComponent]
    });
    fixture = TestBed.createComponent(DailyWeeklyHomogenousDepartureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
