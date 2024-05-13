import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallgraphsComponent } from './rainfallgraphs.component';

describe('RainfallgraphsComponent', () => {
  let component: RainfallgraphsComponent;
  let fixture: ComponentFixture<RainfallgraphsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallgraphsComponent]
    });
    fixture = TestBed.createComponent(RainfallgraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
