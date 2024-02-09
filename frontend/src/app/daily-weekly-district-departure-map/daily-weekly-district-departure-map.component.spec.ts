import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWeeklyDistrictDepartureMapComponent } from './daily-weekly-district-departure-map.component';

describe('DailyWeeklyDistrictDepartureMapComponent', () => {
  let component: DailyWeeklyDistrictDepartureMapComponent;
  let fixture: ComponentFixture<DailyWeeklyDistrictDepartureMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyWeeklyDistrictDepartureMapComponent]
    });
    fixture = TestBed.createComponent(DailyWeeklyDistrictDepartureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
