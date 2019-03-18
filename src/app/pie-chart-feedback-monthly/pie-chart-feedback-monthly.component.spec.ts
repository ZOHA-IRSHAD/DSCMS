import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartFeedbackMonthlyComponent } from './pie-chart-feedback-monthly.component';

describe('PieChartFeedbackMonthlyComponent', () => {
  let component: PieChartFeedbackMonthlyComponent;
  let fixture: ComponentFixture<PieChartFeedbackMonthlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartFeedbackMonthlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartFeedbackMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
