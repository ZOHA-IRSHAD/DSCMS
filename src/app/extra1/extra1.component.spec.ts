import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Extra1Component } from './extra1.component';

describe('Extra1Component', () => {
  let component: Extra1Component;
  let fixture: ComponentFixture<Extra1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Extra1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Extra1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
