import { TestBed } from '@angular/core/testing';

import { TabwindowsService } from './tabwindows.service';

describe('TabwindowsService', () => {
  let service: TabwindowsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabwindowsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
