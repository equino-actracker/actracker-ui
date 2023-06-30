import { TestBed } from '@angular/core/testing';

import { ConvertionService } from './convertion.service';

describe('ConvertionService', () => {
  let service: ConvertionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
