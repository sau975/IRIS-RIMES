import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsWinterCentralindiaregionComponent } from './rainfall-graphs-winter-centralindiaregion.component';

describe('RainfallGraphsWinterCentralindiaregionComponent', () => {
  let component: RainfallGraphsWinterCentralindiaregionComponent;
  let fixture: ComponentFixture<RainfallGraphsWinterCentralindiaregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsWinterCentralindiaregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsWinterCentralindiaregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
