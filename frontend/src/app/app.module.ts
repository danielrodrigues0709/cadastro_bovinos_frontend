import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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

import { MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { HistoricoAnimalComponent } from './pages/historico-animal/historico-animal.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    AppComponent,
    MedicamentosComponent,
    PlantelComponent,
    VacinasComponent,
    OcorrenciasComponent,
    CadastroOcorrenciaComponent,
    CadastroAnimalComponent,
    CadastroVacinaComponent,
    CadastroMedicamentoComponent,
    CadastroInseminacaoComponent,
    CadastroVacinacaoComponent,
    CadastroPartoComponent,
    CadastroUsuarioComponent,
    LoginComponent,
    HistoricoAnimalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MegaMenuModule,
    ButtonModule,
    CardModule,
    TableModule,
    TabViewModule,
    DynamicDialogModule,
    InputTextModule,
    SelectButtonModule,
    InputSwitchModule,
    CalendarModule,
    ConfirmDialogModule,
    ToastModule,
    AutoCompleteModule,
    InputTextareaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
