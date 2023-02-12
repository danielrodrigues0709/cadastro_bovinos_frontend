import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Animal } from 'src/app/interfaces/animal';
import { Inseminacao } from 'src/app/interfaces/inseminacao';
import { AnimaisService } from 'src/app/services/animais.service';
import { InseminacoesService } from 'src/app/services/inseminacoes.service';
import { CadastroInseminacaoComponent } from '../cadastro-inseminacao/cadastro-inseminacao.component';
import { CadastroOcorrenciaComponent } from '../cadastro-ocorrencia/cadastro-ocorrencia.component';
import { CadastroPartoComponent } from '../cadastro-parto/cadastro-parto.component';
import { CadastroVacinacaoComponent } from '../cadastro-vacinacao/cadastro-vacinacao.component';

@Component({
  selector: 'app-historico-animal',
  templateUrl: './historico-animal.component.html',
  styleUrls: ['./historico-animal.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class HistoricoAnimalComponent implements OnInit {

  @Input() data!: Animal;
  details!: {
    header: string;
    component: any;
    service: any;
  }
  inseminacoes: Inseminacao[] = [];

  constructor(
    private _inseminacoesService: InseminacoesService,
    private _animaisService: AnimaisService,
    public dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getInseminacoes(this.data);
  }

  getInseminacoes(animal: Animal):void {
    let params = {
      id_animal: animal.id
    };
    this._inseminacoesService.getInseminacoes(params).pipe().subscribe(res => {
      this.inseminacoes = res.rows;
      this.getDataById(res.rows);
    })
  }

  getDataById(inseminacoes: Inseminacao[]): void {
    inseminacoes.forEach((inseminacao, index) => {
      this._animaisService.getAnimalById(inseminacao.id_reprodutor).subscribe(res => {
        inseminacoes[index] = Object.assign(inseminacoes[index], {
          reprodutor: res.rows[0]
        });
        this.inseminacoes = inseminacoes;
      });
    })
  }

  edit(element: any, detail: string): void {
    switch (detail) {
      case 'inseminacao':
        this.details = {
          header: 'Inseminação',
          component: CadastroInseminacaoComponent,
          service: null
        }
        break;
      case 'parto':
        this.details = {
          header: 'Parto',
          component: CadastroPartoComponent,
          service: null
        }
        break;
      case 'vacinacao':
        this.details = {
          header: 'Vacinação',
          component: CadastroVacinacaoComponent,
          service: null
        }
        break;
      case 'ocorrencia':
        this.details = {
          header: 'Ocorrência',
          component: CadastroOcorrenciaComponent,
          service: null
        }
        break;
    }

    element = {
      ...element,
      animal: this.data
    }
    const ref = this.dialogService.open(this.details.component, {
      data: element,
      header: `Editar ${this.details.header}`,
      width: '80%'
    })
    .onClose.subscribe(() => {
      this.getInseminacoes(this.data)
    });
  }

  delete(id: number, detail: string): void {
    this._confirmationService.confirm({
      message: 'Deseja deletar o registro?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this._inseminacoesService.deleteInseminacao(id).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this.getInseminacoes(this.data);
        },
        err => this._messageService.add({severity:'error', detail: err.error.message}))
      }
    });
  }

}
