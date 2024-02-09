import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalSubdivisionMapComponent } from './normal-subdivision-map.component';

describe('NormalSubdivisionMapComponent', () => {
  let component: NormalSubdivisionMapComponent;
  let fixture: ComponentFixture<NormalSubdivisionMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalSubdivisionMapComponent]
    });
    fixture = TestBed.createComponent(NormalSubdivisionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
