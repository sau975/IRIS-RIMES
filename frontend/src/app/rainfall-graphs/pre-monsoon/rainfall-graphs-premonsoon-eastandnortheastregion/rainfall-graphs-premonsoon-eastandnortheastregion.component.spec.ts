import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsPremonsoonEastandnortheastregionComponent } from './rainfall-graphs-premonsoon-eastandnortheastregion.component';

describe('RainfallGraphsPremonsoonEastandnortheastregionComponent', () => {
  let component: RainfallGraphsPremonsoonEastandnortheastregionComponent;
  let fixture: ComponentFixture<RainfallGraphsPremonsoonEastandnortheastregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsPremonsoonEastandnortheastregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsPremonsoonEastandnortheastregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
