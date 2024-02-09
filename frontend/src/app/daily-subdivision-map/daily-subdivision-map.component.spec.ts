import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySubdivisionMapComponent } from './daily-subdivision-map.component';

describe('DailySubdivisionMapComponent', () => {
  let component: DailySubdivisionMapComponent;
  let fixture: ComponentFixture<DailySubdivisionMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailySubdivisionMapComponent]
    });
    fixture = TestBed.createComponent(DailySubdivisionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
