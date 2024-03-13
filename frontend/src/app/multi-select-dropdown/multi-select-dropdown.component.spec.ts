import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectDropdownComponent } from './multi-select-dropdown.component';

describe('MultiSelectDropdownComponent', () => {
  let component: MultiSelectDropdownComponent;
  let fixture: ComponentFixture<MultiSelectDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiSelectDropdownComponent]
    });
    fixture = TestBed.createComponent(MultiSelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
