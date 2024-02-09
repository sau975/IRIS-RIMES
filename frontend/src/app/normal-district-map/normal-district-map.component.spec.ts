import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalDistrictMapComponent } from './normal-district-map.component';

describe('NormalDistrictMapComponent', () => {
  let component: NormalDistrictMapComponent;
  let fixture: ComponentFixture<NormalDistrictMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalDistrictMapComponent]
    });
    fixture = TestBed.createComponent(NormalDistrictMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
