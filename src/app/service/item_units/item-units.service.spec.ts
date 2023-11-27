import { TestBed } from '@angular/core/testing';

import { ItemUnitsService } from './item-units.service';

describe('ItemUnitsService', () => {
  let service: ItemUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
