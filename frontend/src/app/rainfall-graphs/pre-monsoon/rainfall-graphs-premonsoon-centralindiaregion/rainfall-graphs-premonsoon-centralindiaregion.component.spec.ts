import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainfallGraphsPremonsoonCentralindiaregionComponent } from './rainfall-graphs-premonsoon-centralindiaregion.component';

describe('RainfallGraphsPremonsoonCentralindiaregionComponent', () => {
  let component: RainfallGraphsPremonsoonCentralindiaregionComponent;
  let fixture: ComponentFixture<RainfallGraphsPremonsoonCentralindiaregionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainfallGraphsPremonsoonCentralindiaregionComponent]
    });
    fixture = TestBed.createComponent(RainfallGraphsPremonsoonCentralindiaregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
