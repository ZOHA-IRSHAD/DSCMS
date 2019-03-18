import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartITC6Component } from './Bar-chart-itc6.component';

describe('BarChartITC6Component', () => {
  let component: BarChartITC6Component;
  let fixture: ComponentFixture<BarChartITC6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartITC6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartITC6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
