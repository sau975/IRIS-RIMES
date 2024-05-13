import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinedEmailGroupComponent } from './defined-email-group.component';

describe('DefinedEmailGroupComponent', () => {
  let component: DefinedEmailGroupComponent;
  let fixture: ComponentFixture<DefinedEmailGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefinedEmailGroupComponent]
    });
    fixture = TestBed.createComponent(DefinedEmailGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
