import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredUserComponent } from './expired-user.component';

describe('ExpiredUserComponent', () => {
  let component: ExpiredUserComponent;
  let fixture: ComponentFixture<ExpiredUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
