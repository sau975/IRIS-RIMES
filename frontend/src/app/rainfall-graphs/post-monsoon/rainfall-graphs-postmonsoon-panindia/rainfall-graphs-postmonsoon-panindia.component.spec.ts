import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsPostmonsoonPanindiaComponent } from './rainfall-graphs-postmonsoon-panindia.component';

describe('RainfallGraphsPostmonsoonPanindiaComponent', () => {
  let component: RainfallGraphsPostmonsoonPanindiaComponent;
  let fixture: ComponentFixture<RainfallGraphsPostmonsoonPanindiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsPostmonsoonPanindiaComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsPostmonsoonPanindiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
