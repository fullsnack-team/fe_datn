import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginByDomainNameComponent } from './login-by-domain-name.component';

describe('LoginByDomainNameComponent', () => {
  let component: LoginByDomainNameComponent;
  let fixture: ComponentFixture<LoginByDomainNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginByDomainNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginByDomainNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
