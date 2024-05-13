import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsPremonsoonSouthpeninsularregionComponent } from './rainfall-graphs-premonsoon-southpeninsularregion.component';

describe('RainfallGraphsPremonsoonSouthpeninsularregionComponent', () => {
  let component: RainfallGraphsPremonsoonSouthpeninsularregionComponent;
  let fixture: ComponentFixture<RainfallGraphsPremonsoonSouthpeninsularregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsPremonsoonSouthpeninsularregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsPremonsoonSouthpeninsularregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
