import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartITC7Component } from './Bar-chart-itc7.component';

describe('LineChartITC7Component', () => {
  let component: BarChartITC7Component;
  let fixture: ComponentFixture<BarChartITC7Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartITC7Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartITC7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
