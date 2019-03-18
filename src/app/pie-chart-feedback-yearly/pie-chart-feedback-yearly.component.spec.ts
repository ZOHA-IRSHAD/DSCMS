import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartFeedbackYearlyComponent } from './pie-chart-feedback-yearly.component';

describe('PieChartFeedbackYearlyComponent', () => {
  let component: PieChartFeedbackYearlyComponent;
  let fixture: ComponentFixture<PieChartFeedbackYearlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartFeedbackYearlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartFeedbackYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
