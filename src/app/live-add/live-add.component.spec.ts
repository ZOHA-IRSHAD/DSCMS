import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveAddComponent } from './live-add.component';

describe('LiveAddComponent', () => {
  let component: LiveAddComponent;
  let fixture: ComponentFixture<LiveAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
