import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginByStaffComponent } from './login-by-staff.component';

describe('LoginByStaffComponent', () => {
  let component: LoginByStaffComponent;
  let fixture: ComponentFixture<LoginByStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginByStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginByStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
