import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsPostmonsoonNorthwestregionComponent } from './rainfall-graphs-postmonsoon-northwestregion.component';

describe('RainfallGraphsPostmonsoonNorthwestregionComponent', () => {
  let component: RainfallGraphsPostmonsoonNorthwestregionComponent;
  let fixture: ComponentFixture<RainfallGraphsPostmonsoonNorthwestregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsPostmonsoonNorthwestregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsPostmonsoonNorthwestregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
