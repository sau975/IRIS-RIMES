import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWeeklyCountryDepartureMapComponent } from './daily-weekly-country-departure-map.component';

describe('DailyWeeklyCountryDepartureMapComponent', () => {
  let component: DailyWeeklyCountryDepartureMapComponent;
  let fixture: ComponentFixture<DailyWeeklyCountryDepartureMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyWeeklyCountryDepartureMapComponent]
    });
    fixture = TestBed.createComponent(DailyWeeklyCountryDepartureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
