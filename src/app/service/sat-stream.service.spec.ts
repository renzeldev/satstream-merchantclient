import { TestBed } from '@angular/core/testing';

import { SatStreamService } from './sat-stream.service';

describe('SatStreamService', () => {
  let service: SatStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SatStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
