import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginByEnterpriseComponent } from './login-by-enterprise.component';

describe('LoginByEnterpriseComponent', () => {
  let component: LoginByEnterpriseComponent;
  let fixture: ComponentFixture<LoginByEnterpriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginByEnterpriseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginByEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
