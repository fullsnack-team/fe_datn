import { TestBed } from '@angular/core/testing';

import { DatalayoutService } from './datalayout.service';

describe('DatalayoutService', () => {
  let service: DatalayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatalayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
