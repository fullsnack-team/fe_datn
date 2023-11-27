import { TestBed } from '@angular/core/testing';

import { StorageImportService } from './storage-import.service';

describe('StorageImportService', () => {
  let service: StorageImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
