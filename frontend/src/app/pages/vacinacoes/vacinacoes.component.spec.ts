import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacinacoesComponent } from './vacinacoes.component';

describe('VacinacoesComponent', () => {
  let component: VacinacoesComponent;
  let fixture: ComponentFixture<VacinacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacinacoesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacinacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
