import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationPageComponent } from './verification-page.component';

describe('VerificationPageComponent', () => {
  let component: VerificationPageComponent;
  let fixture: ComponentFixture<VerificationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationPageComponent]
    });
    fixture = TestBed.createComponent(VerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
