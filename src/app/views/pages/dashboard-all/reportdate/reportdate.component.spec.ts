import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdateComponent } from './reportdate.component';

describe('ReportdateComponent', () => {
  let component: ReportdateComponent;
  let fixture: ComponentFixture<ReportdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
