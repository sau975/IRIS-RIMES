import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWeeklyStateDepartureMapComponent } from './daily-weekly-state-departure-map.component';

describe('DailyWeeklyStateDepartureMapComponent', () => {
  let component: DailyWeeklyStateDepartureMapComponent;
  let fixture: ComponentFixture<DailyWeeklyStateDepartureMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyWeeklyStateDepartureMapComponent]
    });
    fixture = TestBed.createComponent(DailyWeeklyStateDepartureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
