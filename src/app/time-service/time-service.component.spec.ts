import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeServiceComponent } from './time-service.component';

describe('TimeServiceComponent', () => {
  let component: TimeServiceComponent;
  let fixture: ComponentFixture<TimeServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
