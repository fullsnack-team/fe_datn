import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUnitsEditComponent } from './item-units-edit.component';

describe('ItemUnitsEditComponent', () => {
  let component: ItemUnitsEditComponent;
  let fixture: ComponentFixture<ItemUnitsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemUnitsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemUnitsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
