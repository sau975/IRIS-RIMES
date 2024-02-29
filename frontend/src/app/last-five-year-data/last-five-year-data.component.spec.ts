import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastFiveYearDataComponent } from './last-five-year-data.component';

describe('LastFiveYearDataComponent', () => {
  let component: LastFiveYearDataComponent;
  let fixture: ComponentFixture<LastFiveYearDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastFiveYearDataComponent]
    });
    fixture = TestBed.createComponent(LastFiveYearDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
