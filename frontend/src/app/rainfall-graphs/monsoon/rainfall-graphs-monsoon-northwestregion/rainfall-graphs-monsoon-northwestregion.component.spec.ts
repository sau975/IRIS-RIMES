import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsMonsoonNorthwestregionComponent } from './rainfall-graphs-monsoon-northwestregion.component';

describe('RainfallGraphsMonsoonNorthwestregionComponent', () => {
  let component: RainfallGraphsMonsoonNorthwestregionComponent;
  let fixture: ComponentFixture<RainfallGraphsMonsoonNorthwestregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsMonsoonNorthwestregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsMonsoonNorthwestregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
