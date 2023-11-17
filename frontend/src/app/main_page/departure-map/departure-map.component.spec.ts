import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartureMapComponent } from './departure-map.component';

describe('DepartureMapComponent', () => {
  let component: DepartureMapComponent;
  let fixture: ComponentFixture<DepartureMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartureMapComponent]
    });
    fixture = TestBed.createComponent(DepartureMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
