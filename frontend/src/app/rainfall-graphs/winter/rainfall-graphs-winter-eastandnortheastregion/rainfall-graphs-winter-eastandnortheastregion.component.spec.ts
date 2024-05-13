import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsWinterEastandnortheastregionComponent } from './rainfall-graphs-winter-eastandnortheastregion.component';

describe('RainfallGraphsWinterEastandnortheastregionComponent', () => {
  let component: RainfallGraphsWinterEastandnortheastregionComponent;
  let fixture: ComponentFixture<RainfallGraphsWinterEastandnortheastregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsWinterEastandnortheastregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsWinterEastandnortheastregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
