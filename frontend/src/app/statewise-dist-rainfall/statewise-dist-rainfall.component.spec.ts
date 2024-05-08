import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatewiseDistRainfallComponent } from './statewise-dist-rainfall.component';

describe('StatewiseDistRainfallComponent', () => {
  let component: StatewiseDistRainfallComponent;
  let fixture: ComponentFixture<StatewiseDistRainfallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatewiseDistRainfallComponent]
    });
    fixture = TestBed.createComponent(StatewiseDistRainfallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
