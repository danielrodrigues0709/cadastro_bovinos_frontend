import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InseminacoesComponent } from './inseminacoes.component';

describe('InseminacoesComponent', () => {
  let component: InseminacoesComponent;
  let fixture: ComponentFixture<InseminacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InseminacoesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InseminacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
