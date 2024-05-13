import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsMonsoonCentralindiaregionComponent } from './rainfall-graphs-monsoon-centralindiaregion.component';

describe('RainfallGraphsMonsoonCentralindiaregionComponent', () => {
  let component: RainfallGraphsMonsoonCentralindiaregionComponent;
  let fixture: ComponentFixture<RainfallGraphsMonsoonCentralindiaregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsMonsoonCentralindiaregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsMonsoonCentralindiaregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
