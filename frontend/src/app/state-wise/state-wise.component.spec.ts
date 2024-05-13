import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateWiseComponent } from './state-wise.component';

describe('StateWiseComponent', () => {
  let component: StateWiseComponent;
  let fixture: ComponentFixture<StateWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateWiseComponent]
    });
    fixture = TestBed.createComponent(StateWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
