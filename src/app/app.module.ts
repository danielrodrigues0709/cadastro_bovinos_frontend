import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { registerLocaleData } from '@angular/common';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { MenubarModule } from 'primeng/menubar';
import { InputMaskModule } from 'primeng/inputmask';
import localeBr from '@angular/common/locales/pt';
registerLocaleData(localeBr);

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
import { HistoricoAnimalComponent } from './pages/historico-animal/historico-animal.component';
import { VacinacoesComponent } from './pages/vacinacoes/vacinacoes.component';
import { InseminacoesComponent } from './pages/inseminacoes/inseminacoes.component';
import { PartosComponent } from './pages/partos/partos.component';
import { FamilyTreeComponent } from './pages/family-tree/family-tree.component';
import { EdicaoUsuarioComponent } from './pages/edicao-usuario/edicao-usuario.component';

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
    HistoricoAnimalComponent,
    VacinacoesComponent,
    InseminacoesComponent,
    PartosComponent,
    FamilyTreeComponent,
    EdicaoUsuarioComponent
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
    InputTextareaModule,
    OrganizationChartModule,
    MenubarModule,
    InputMaskModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
