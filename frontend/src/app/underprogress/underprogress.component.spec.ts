import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderprogressComponent } from './underprogress.component';

describe('UnderprogressComponent', () => {
  let component: UnderprogressComponent;
  let fixture: ComponentFixture<UnderprogressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnderprogressComponent]
    });
    fixture = TestBed.createComponent(UnderprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
