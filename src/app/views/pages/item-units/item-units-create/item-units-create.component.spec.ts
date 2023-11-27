import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUnitsCreateComponent } from './item-units-create.component';

describe('ItemUnitsCreateComponent', () => {
  let component: ItemUnitsCreateComponent;
  let fixture: ComponentFixture<ItemUnitsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemUnitsCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemUnitsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
