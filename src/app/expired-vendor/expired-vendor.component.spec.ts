import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredVendorComponent } from './expired-vendor.component';

describe('ExpiredVendorComponent', () => {
  let component: ExpiredVendorComponent;
  let fixture: ComponentFixture<ExpiredVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
