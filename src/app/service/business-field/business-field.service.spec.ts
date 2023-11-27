import { TestBed } from '@angular/core/testing';

import { BusinessFieldService } from './business-field.service';

describe('BusinessFielaService', () => {
  let service: BusinessFieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessFieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
