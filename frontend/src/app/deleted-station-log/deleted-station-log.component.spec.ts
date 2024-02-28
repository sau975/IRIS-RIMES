import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedStationLogComponent } from './deleted-station-log.component';

describe('DeletedStationLogComponent', () => {
  let component: DeletedStationLogComponent;
  let fixture: ComponentFixture<DeletedStationLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedStationLogComponent]
    });
    fixture = TestBed.createComponent(DeletedStationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
