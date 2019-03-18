import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartFeedbackWeeklyComponent } from './pie-chart-feedback-weekly.component';

describe('PieChartFeedbackWeeklyComponent', () => {
  let component: PieChartFeedbackWeeklyComponent;
  let fixture: ComponentFixture<PieChartFeedbackWeeklyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartFeedbackWeeklyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartFeedbackWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
