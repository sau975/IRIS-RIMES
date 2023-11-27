import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationLevelDataComponent } from './station-level-data.component';

describe('StationLevelDataComponent', () => {
  let component: StationLevelDataComponent;
  let fixture: ComponentFixture<StationLevelDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StationLevelDataComponent]
    });
    fixture = TestBed.createComponent(StationLevelDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
