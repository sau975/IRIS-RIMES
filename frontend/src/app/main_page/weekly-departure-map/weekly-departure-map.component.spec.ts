import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyDepartureMapComponent } from './weekly-departure-map.component';

describe('WeeklyDepartureMapComponent', () => {
  let component: WeeklyDepartureMapComponent;
  let fixture: ComponentFixture<WeeklyDepartureMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeeklyDepartureMapComponent]
    });
    fixture = TestBed.createComponent(WeeklyDepartureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
