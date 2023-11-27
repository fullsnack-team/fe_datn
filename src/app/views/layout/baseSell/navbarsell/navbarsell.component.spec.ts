import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarsellComponent } from './navbarsell.component';

describe('NavbarsellComponent', () => {
  let component: NavbarsellComponent;
  let fixture: ComponentFixture<NavbarsellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarsellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarsellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
