import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartITC7DailyComponent } from './pie-chart-itc7-daily.component';

describe('PieChartITC7DailyComponent', () => {
  let component: PieChartITC7DailyComponent;
  let fixture: ComponentFixture<PieChartITC7DailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartITC7DailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartITC7DailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
