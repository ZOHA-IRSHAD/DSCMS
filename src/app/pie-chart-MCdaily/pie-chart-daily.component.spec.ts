import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartDailyComponent } from './pie-chart-daily.component';

describe('PieChartDailyComponent', () => {
  let component: PieChartDailyComponent;
  let fixture: ComponentFixture<PieChartDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
