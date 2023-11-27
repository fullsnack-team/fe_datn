import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseSpecialComponent } from './base-special.component';

describe('BaseSpecialComponent', () => {
  let component: BaseSpecialComponent;
  let fixture: ComponentFixture<BaseSpecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseSpecialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
