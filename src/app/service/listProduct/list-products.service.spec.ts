import { TestBed } from '@angular/core/testing';

import { ListProductsService } from './list-products.service';

describe('ListProductsService', () => {
  let service: ListProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
