import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLogComponent } from './email-log.component';

describe('EmailLogComponent', () => {
  let component: EmailLogComponent;
  let fixture: ComponentFixture<EmailLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailLogComponent]
    });
    fixture = TestBed.createComponent(EmailLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
