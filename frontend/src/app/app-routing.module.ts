import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicamentosComponent } from './pages/medicamentos/medicamentos.component';
import { PlantelComponent } from './pages/plantel/plantel.component';
import { VacinasComponent } from './pages/vacinas/vacinas.component';
import { OcorrenciasComponent } from './pages/ocorrencias/ocorrencias.component';
import { CadastroOcorrenciaComponent } from './pages/cadastro-ocorrencia/cadastro-ocorrencia.component';
import { CadastroAnimalComponent } from './pages/cadastro-animal/cadastro-animal.component';
import { CadastroVacinaComponent } from './pages/cadastro-vacina/cadastro-vacina.component';
import { CadastroMedicamentoComponent } from './pages/cadastro-medicamento/cadastro-medicamento.component';
import { CadastroInseminacaoComponent } from './pages/cadastro-inseminacao/cadastro-inseminacao.component';
import { CadastroVacinacaoComponent } from './pages/cadastro-vacinacao/cadastro-vacinacao.component';
import { CadastroPartoComponent } from './pages/cadastro-parto/cadastro-parto.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { LoginComponent } from './pages/login/login.component';
import { VacinacoesComponent } from './pages/vacinacoes/vacinacoes.component';
import { PartosComponent } from './pages/partos/partos.component';
import { InseminacoesComponent } from './pages/inseminacoes/inseminacoes.component';

const routes: Routes = [
  { path: '', redirectTo: 'animais', pathMatch: 'full' },
  { path: 'home', redirectTo: 'animais', pathMatch: 'full' },
  {
    path: 'animais',
    component: PlantelComponent,
  },
  {
    path: 'animais/cadastro',
    component: CadastroAnimalComponent,
  },
  {
    path: 'animais/inseminacao',
    component: CadastroInseminacaoComponent,
  },
  {
    path: 'animais/vacinacao',
    component: CadastroVacinacaoComponent,
  },
  {
    path: 'animais/parto',
    component: CadastroPartoComponent,
  },
  {
    path: 'medicamentos',
    component: MedicamentosComponent,
    children: []
  },
  {
    path: 'medicamentos/cadastro',
    component: CadastroMedicamentoComponent,
  },
  {
    path: 'vacinas',
    component: VacinasComponent,
    children: []
  },
  {
    path: 'vacinas/cadastro',
    component: CadastroVacinaComponent,
  },
  {
    path: 'ocorrencias',
    component: OcorrenciasComponent,
    children: []
  },
  {
    path: 'ocorrencias/cadastro',
    component: CadastroOcorrenciaComponent,
  },
  {
    path: 'vacinacoes',
    component: VacinacoesComponent,
    children: []
  },
  {
    path: 'vacinacoes/cadastro',
    component: CadastroVacinacaoComponent,
  },
  {
    path: 'partos',
    component: PartosComponent,
    children: []
  },
  {
    path: 'partos/cadastro',
    component: CadastroPartoComponent,
  },
  {
    path: 'inseminacoes',
    component: InseminacoesComponent,
    children: []
  },
  {
    path: 'inseminacoes/cadastro',
    component: CadastroInseminacaoComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
