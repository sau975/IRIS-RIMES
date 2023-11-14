import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalMapComponent } from './normal-map.component';

describe('NormalMapComponent', () => {
  let component: NormalMapComponent;
  let fixture: ComponentFixture<NormalMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalMapComponent]
    });
    fixture = TestBed.createComponent(NormalMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
