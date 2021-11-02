import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicamentosComponent } from './pages/medicamentos/medicamentos.component';

const routes: Routes = [
  {
    path: '',
    component: MedicamentosComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
