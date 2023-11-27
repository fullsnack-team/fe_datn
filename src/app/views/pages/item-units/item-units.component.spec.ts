import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUnitsComponent } from './item-units.component';

describe('ItemUnitsComponent', () => {
  let component: ItemUnitsComponent;
  let fixture: ComponentFixture<ItemUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemUnitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
