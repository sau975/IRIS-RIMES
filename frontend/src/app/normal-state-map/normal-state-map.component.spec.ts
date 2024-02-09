import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalStateMapComponent } from './normal-state-map.component';

describe('NormalStateMapComponent', () => {
  let component: NormalStateMapComponent;
  let fixture: ComponentFixture<NormalStateMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalStateMapComponent]
    });
    fixture = TestBed.createComponent(NormalStateMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
