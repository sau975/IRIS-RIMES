import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalHomogenousMapComponent } from './normal-homogenous-map.component';

describe('NormalHomogenousMapComponent', () => {
  let component: NormalHomogenousMapComponent;
  let fixture: ComponentFixture<NormalHomogenousMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalHomogenousMapComponent]
    });
    fixture = TestBed.createComponent(NormalHomogenousMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
