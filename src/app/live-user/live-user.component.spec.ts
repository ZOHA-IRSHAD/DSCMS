import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveUserComponent } from './live-user.component';

describe('LiveUserComponent', () => {
  let component: LiveUserComponent;
  let fixture: ComponentFixture<LiveUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
