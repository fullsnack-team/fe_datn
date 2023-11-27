import { TestBed } from '@angular/core/testing';

import { AresService } from './ares.service';

describe('AresService', () => {
  let service: AresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
