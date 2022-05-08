import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicamentosComponent } from './pages/medicamentos/medicamentos.component';
import { PlantelComponent } from './pages/plantel/plantel.component';

const routes: Routes = [
  { path: '', redirectTo: 'plantel', pathMatch: 'full' },
  {
    path: 'plantel',
    component: PlantelComponent,
    children: []
  },
  {
    path: 'medicamentos',
    component: MedicamentosComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
