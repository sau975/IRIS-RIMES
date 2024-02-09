import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDistrictMapComponent } from './daily-district-map.component';

describe('DailyDistrictMapComponent', () => {
  let component: DailyDistrictMapComponent;
  let fixture: ComponentFixture<DailyDistrictMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyDistrictMapComponent]
    });
    fixture = TestBed.createComponent(DailyDistrictMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
