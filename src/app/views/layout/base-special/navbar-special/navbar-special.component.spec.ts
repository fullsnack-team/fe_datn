import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSpecialComponent } from './navbar-special.component';

describe('NavbarSpecialComponent', () => {
  let component: NavbarSpecialComponent;
  let fixture: ComponentFixture<NavbarSpecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarSpecialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
