import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportpaymentComponent } from './reportpayment.component';

describe('ReportpaymentComponent', () => {
  let component: ReportpaymentComponent;
  let fixture: ComponentFixture<ReportpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportpaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
