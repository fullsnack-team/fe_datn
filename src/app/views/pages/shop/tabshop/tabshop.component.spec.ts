import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabshopComponent } from './tabshop.component';

describe('TabshopComponent', () => {
  let component: TabshopComponent;
  let fixture: ComponentFixture<TabshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabshopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
