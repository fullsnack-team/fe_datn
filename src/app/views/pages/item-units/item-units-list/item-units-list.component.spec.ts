import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUnitsListComponent } from './item-units-list.component';

describe('ItemUnitsListComponent', () => {
  let component: ItemUnitsListComponent;
  let fixture: ComponentFixture<ItemUnitsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemUnitsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemUnitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
