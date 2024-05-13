import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsWinterSouthpeninsularregionComponent } from './rainfall-graphs-winter-southpeninsularregion.component';

describe('RainfallGraphsWinterSouthpeninsularregionComponent', () => {
  let component: RainfallGraphsWinterSouthpeninsularregionComponent;
  let fixture: ComponentFixture<RainfallGraphsWinterSouthpeninsularregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsWinterSouthpeninsularregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsWinterSouthpeninsularregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
