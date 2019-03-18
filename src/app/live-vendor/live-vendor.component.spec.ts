import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveVendorComponent } from './live-vendor.component';

describe('LiveVendorComponent', () => {
  let component: LiveVendorComponent;
  let fixture: ComponentFixture<LiveVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
