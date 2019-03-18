import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartmcComponent } from './barchartmc.component';

describe('LinechartComponent', () => {
  let component: BarchartmcComponent;
  let fixture: ComponentFixture<BarchartmcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarchartmcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarchartmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
