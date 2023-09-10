import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroVacinacaoComponent } from './cadastro-vacinacao.component';

describe('CadastroVacinacaoComponent', () => {
  let component: CadastroVacinacaoComponent;
  let fixture: ComponentFixture<CadastroVacinacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroVacinacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroVacinacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
