import { TestBed } from '@angular/core/testing';

import { GroupSuppliersService } from './group-suppliers.service';

describe('GroupSuppliersService', () => {
  let service: GroupSuppliersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupSuppliersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
