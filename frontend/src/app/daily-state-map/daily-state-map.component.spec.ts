import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyStateMapComponent } from './daily-state-map.component';

describe('DailyStateMapComponent', () => {
  let component: DailyStateMapComponent;
  let fixture: ComponentFixture<DailyStateMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyStateMapComponent]
    });
    fixture = TestBed.createComponent(DailyStateMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
