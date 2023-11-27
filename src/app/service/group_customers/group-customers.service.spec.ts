import { TestBed } from '@angular/core/testing';

import { GroupCustomersService } from './group-customers.service';

describe('GroupCustomersService', () => {
  let service: GroupCustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupCustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
