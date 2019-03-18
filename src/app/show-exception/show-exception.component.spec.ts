import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowExceptionComponent } from './show-exception.component';

describe('ShowExceptionComponent', () => {
  let component: ShowExceptionComponent;
  let fixture: ComponentFixture<ShowExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
