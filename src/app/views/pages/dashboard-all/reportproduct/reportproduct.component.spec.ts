import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportproductComponent } from './reportproduct.component';

describe('ReportproductComponent', () => {
  let component: ReportproductComponent;
  let fixture: ComponentFixture<ReportproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportproductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
