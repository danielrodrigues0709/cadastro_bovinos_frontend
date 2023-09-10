import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroOcorrenciaComponent } from './cadastro-ocorrencia.component';

describe('CadastroOcorrenciaComponent', () => {
  let component: CadastroOcorrenciaComponent;
  let fixture: ComponentFixture<CadastroOcorrenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroOcorrenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroOcorrenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
