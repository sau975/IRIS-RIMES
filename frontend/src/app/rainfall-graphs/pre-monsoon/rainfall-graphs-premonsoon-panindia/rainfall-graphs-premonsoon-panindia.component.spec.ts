import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsPremonsoonPanindiaComponent } from './rainfall-graphs-premonsoon-panindia.component';

describe('RainfallGraphsPremonsoonPanindiaComponent', () => {
  let component: RainfallGraphsPremonsoonPanindiaComponent;
  let fixture: ComponentFixture<RainfallGraphsPremonsoonPanindiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsPremonsoonPanindiaComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsPremonsoonPanindiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
