import { TestBed } from '@angular/core/testing';

import { Publishers } from './publishers';

describe('Publishers', () => {
  let service: Publishers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Publishers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
