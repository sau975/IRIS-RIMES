import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailDisseminationComponent } from './email-dissemination.component';

describe('EmailDisseminationComponent', () => {
  let component: EmailDisseminationComponent;
  let fixture: ComponentFixture<EmailDisseminationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailDisseminationComponent]
    });
    fixture = TestBed.createComponent(EmailDisseminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
