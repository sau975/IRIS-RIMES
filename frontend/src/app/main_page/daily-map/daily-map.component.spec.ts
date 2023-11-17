import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMapComponent } from './daily-map.component';

describe('DailyMapComponent', () => {
  let component: DailyMapComponent;
  let fixture: ComponentFixture<DailyMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyMapComponent]
    });
    fixture = TestBed.createComponent(DailyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
