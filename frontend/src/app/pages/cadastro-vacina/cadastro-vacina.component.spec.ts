import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroVacinaComponent } from './cadastro-vacina.component';

describe('CadastroVacinaComponent', () => {
  let component: CadastroVacinaComponent;
  let fixture: ComponentFixture<CadastroVacinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroVacinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroVacinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
