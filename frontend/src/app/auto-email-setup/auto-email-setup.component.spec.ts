import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoEmailSetupComponent } from './auto-email-setup.component';

describe('AutoEmailSetupComponent', () => {
  let component: AutoEmailSetupComponent;
  let fixture: ComponentFixture<AutoEmailSetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoEmailSetupComponent]
    });
    fixture = TestBed.createComponent(AutoEmailSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
