import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredAddComponent } from './expired-add.component';

describe('ExpiredAddComponent', () => {
  let component: ExpiredAddComponent;
  let fixture: ComponentFixture<ExpiredAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
