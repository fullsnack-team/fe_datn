import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintfComponent } from './printf.component';

describe('PrintfComponent', () => {
  let component: PrintfComponent;
  let fixture: ComponentFixture<PrintfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
