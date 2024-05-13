import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsMonsoonEastandnortheastregionComponent } from './rainfall-graphs-monsoon-eastandnortheastregion.component';

describe('RainfallGraphsMonsoonEastandnortheastregionComponent', () => {
  let component: RainfallGraphsMonsoonEastandnortheastregionComponent;
  let fixture: ComponentFixture<RainfallGraphsMonsoonEastandnortheastregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsMonsoonEastandnortheastregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsMonsoonEastandnortheastregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
