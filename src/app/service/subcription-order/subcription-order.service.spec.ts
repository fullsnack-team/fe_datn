import { TestBed } from '@angular/core/testing';

import { SubcriptionOrderService } from './subcription-order.service';

describe('SubcriptionOrderService', () => {
  let service: SubcriptionOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubcriptionOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
