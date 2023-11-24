import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataentryComponent } from './dataentry.component';

describe('DataentryComponent', () => {
  let component: DataentryComponent;
  let fixture: ComponentFixture<DataentryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataentryComponent]
    });
    fixture = TestBed.createComponent(DataentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
