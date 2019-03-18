import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredLocationComponent } from './expired-location.component';

describe('ExpiredLocationComponent', () => {
  let component: ExpiredLocationComponent;
  let fixture: ComponentFixture<ExpiredLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
