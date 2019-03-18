import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartITC5Component } from './Bar-chart-itc5.component';

describe('LineChartITC5Component', () => {
  let component: BarChartITC5Component;
  let fixture: ComponentFixture<BarChartITC5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartITC5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartITC5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
