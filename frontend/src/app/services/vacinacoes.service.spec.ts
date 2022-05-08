import { TestBed } from '@angular/core/testing';

import { VacinacoesService } from './vacinacoes.service';

describe('VacinacoesService', () => {
  let service: VacinacoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacinacoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
