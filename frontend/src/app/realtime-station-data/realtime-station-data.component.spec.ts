import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeStationDataComponent } from './realtime-station-data.component';

describe('RealtimeStationDataComponent', () => {
  let component: RealtimeStationDataComponent;
  let fixture: ComponentFixture<RealtimeStationDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealtimeStationDataComponent]
    });
    fixture = TestBed.createComponent(RealtimeStationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
