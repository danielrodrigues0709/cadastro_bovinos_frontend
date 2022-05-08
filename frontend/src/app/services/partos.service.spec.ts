import { TestBed } from '@angular/core/testing';

import { PartosService } from './partos.service';

describe('PartosService', () => {
  let service: PartosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
