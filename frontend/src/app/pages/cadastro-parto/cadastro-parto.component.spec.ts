import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPartoComponent } from './cadastro-parto.component';

describe('CadastroPartoComponent', () => {
  let component: CadastroPartoComponent;
  let fixture: ComponentFixture<CadastroPartoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroPartoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroPartoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
