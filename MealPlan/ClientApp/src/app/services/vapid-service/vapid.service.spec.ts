import { TestBed } from '@angular/core/testing';

import { VapidService } from './vapid.service';

describe('VapidService', () => {
  let service: VapidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VapidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
