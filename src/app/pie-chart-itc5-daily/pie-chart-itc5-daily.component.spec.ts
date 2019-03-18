import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartITC5DailyComponent } from './pie-chart-itc5-daily.component';

describe('PieChartITC5DailyComponent', () => {
  let component: PieChartITC5DailyComponent;
  let fixture: ComponentFixture<PieChartITC5DailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartITC5DailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartITC5DailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
