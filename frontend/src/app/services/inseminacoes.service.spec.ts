import { TestBed } from '@angular/core/testing';

import { InseminacoesService } from './inseminacoes.service';

describe('InseminacoesService', () => {
  let service: InseminacoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InseminacoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
