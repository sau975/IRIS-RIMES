import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailComponent } from './send-email.component';

describe('SendEmailComponent', () => {
  let component: SendEmailComponent;
  let fixture: ComponentFixture<SendEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendEmailComponent]
    });
    fixture = TestBed.createComponent(SendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
