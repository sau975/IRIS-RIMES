import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyHomogenousMapComponent } from './daily-homogenous-map.component';

describe('DailyHomogenousMapComponent', () => {
  let component: DailyHomogenousMapComponent;
  let fixture: ComponentFixture<DailyHomogenousMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyHomogenousMapComponent]
    });
    fixture = TestBed.createComponent(DailyHomogenousMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
