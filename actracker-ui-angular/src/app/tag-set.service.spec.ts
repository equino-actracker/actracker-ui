import { TestBed } from '@angular/core/testing';

import { TagSetService } from './tag-set.service';

describe('TagSetService', () => {
  let service: TagSetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagSetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
