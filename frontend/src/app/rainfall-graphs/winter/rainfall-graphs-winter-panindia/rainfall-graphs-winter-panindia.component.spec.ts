import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsWinterPanindiaComponent } from './rainfall-graphs-winter-panindia.component';

describe('RainfallGraphsWinterPanindiaComponent', () => {
  let component: RainfallGraphsWinterPanindiaComponent;
  let fixture: ComponentFixture<RainfallGraphsWinterPanindiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsWinterPanindiaComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsWinterPanindiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
