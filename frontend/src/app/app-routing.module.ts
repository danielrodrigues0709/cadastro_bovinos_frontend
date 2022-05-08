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

const routes: Routes = [
  { path: '', redirectTo: 'animais', pathMatch: 'full' },
  {
    path: 'animais',
    component: PlantelComponent,
    children: [
      {
        path: 'cadastro',
        component: CadastroAnimalComponent,
      },
      {
        path: 'inseminacao',
        component: CadastroInseminacaoComponent,
      },
      {
        path: 'vacinacao',
        component: CadastroVacinacaoComponent,
      },
      {
        path: 'parto',
        component: CadastroPartoComponent,
      }
    ]
  },
  {
    path: 'medicamentos',
    component: MedicamentosComponent,
    children: [
      {
        path: 'cadastro',
        component: CadastroMedicamentoComponent,
      }
    ]
  },
  {
    path: 'vacinas',
    component: VacinasComponent,
    children: [
      {
        path: 'cadastro',
        component: CadastroVacinaComponent,
      }
    ]
  },
  {
    path: 'ocorrencias',
    component: OcorrenciasComponent,
    children: [
      {
        path: 'cadastro',
        component: CadastroOcorrenciaComponent,
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      {
        path: 'cadastro',
        component: CadastroUsuarioComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
