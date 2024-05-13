import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsMonsoonSouthpeninsularregionComponent } from './rainfall-graphs-monsoon-southpeninsularregion.component';

describe('RainfallGraphsMonsoonSouthpeninsularregionComponent', () => {
  let component: RainfallGraphsMonsoonSouthpeninsularregionComponent;
  let fixture: ComponentFixture<RainfallGraphsMonsoonSouthpeninsularregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsMonsoonSouthpeninsularregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsMonsoonSouthpeninsularregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
