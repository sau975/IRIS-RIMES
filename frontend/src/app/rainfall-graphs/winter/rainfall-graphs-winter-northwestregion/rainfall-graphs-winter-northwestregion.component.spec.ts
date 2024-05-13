import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsWinterNorthwestregionComponent } from './rainfall-graphs-winter-northwestregion.component';

describe('RainfallGraphsWinterNorthwestregionComponent', () => {
  let component: RainfallGraphsWinterNorthwestregionComponent;
  let fixture: ComponentFixture<RainfallGraphsWinterNorthwestregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsWinterNorthwestregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsWinterNorthwestregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
