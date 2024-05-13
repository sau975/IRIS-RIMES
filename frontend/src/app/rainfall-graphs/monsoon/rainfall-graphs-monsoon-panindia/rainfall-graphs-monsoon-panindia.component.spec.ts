import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsMonsoonPanindiaComponent } from './rainfall-graphs-monsoon-panindia.component';

describe('RainfallGraphsMonsoonPanindiaComponent', () => {
  let component: RainfallGraphsMonsoonPanindiaComponent;
  let fixture: ComponentFixture<RainfallGraphsMonsoonPanindiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsMonsoonPanindiaComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsMonsoonPanindiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
