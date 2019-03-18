import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartITC6DailyComponent } from './pie-chart-itc6-daily.component';

describe('PieChartITC6DailyComponent', () => {
  let component: PieChartITC6DailyComponent;
  let fixture: ComponentFixture<PieChartITC6DailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartITC6DailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartITC6DailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
