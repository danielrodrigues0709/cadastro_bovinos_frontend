import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroInseminacaoComponent } from './cadastro-inseminacao.component';

describe('CadastroInseminacaoComponent', () => {
  let component: CadastroInseminacaoComponent;
  let fixture: ComponentFixture<CadastroInseminacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroInseminacaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroInseminacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
