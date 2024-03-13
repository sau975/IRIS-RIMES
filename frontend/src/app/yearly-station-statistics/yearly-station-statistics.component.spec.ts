import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyStationStatisticsComponent } from './yearly-station-statistics.component';

describe('YearlyStationStatisticsComponent', () => {
  let component: YearlyStationStatisticsComponent;
  let fixture: ComponentFixture<YearlyStationStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YearlyStationStatisticsComponent]
    });
    fixture = TestBed.createComponent(YearlyStationStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
