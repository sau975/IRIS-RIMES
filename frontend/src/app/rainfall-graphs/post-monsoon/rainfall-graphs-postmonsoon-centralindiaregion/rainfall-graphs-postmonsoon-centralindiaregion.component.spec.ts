import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsPostmonsoonCentralindiaregionComponent } from './rainfall-graphs-postmonsoon-centralindiaregion.component';

describe('RainfallGraphsPostmonsoonCentralindiaregionComponent', () => {
  let component: RainfallGraphsPostmonsoonCentralindiaregionComponent;
  let fixture: ComponentFixture<RainfallGraphsPostmonsoonCentralindiaregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsPostmonsoonCentralindiaregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsPostmonsoonCentralindiaregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
