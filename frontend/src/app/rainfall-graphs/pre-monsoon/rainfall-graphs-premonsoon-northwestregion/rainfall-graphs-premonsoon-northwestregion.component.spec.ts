import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsPremonsoonNorthwestregionComponent } from './rainfall-graphs-premonsoon-northwestregion.component';

describe('RainfallGraphsPremonsoonNorthwestregionComponent', () => {
  let component: RainfallGraphsPremonsoonNorthwestregionComponent;
  let fixture: ComponentFixture<RainfallGraphsPremonsoonNorthwestregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsPremonsoonNorthwestregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsPremonsoonNorthwestregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
