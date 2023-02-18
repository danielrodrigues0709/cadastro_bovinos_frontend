import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Animal } from 'src/app/interfaces/animal';
import { Inseminacao } from 'src/app/interfaces/inseminacao';
import { Ocorrencia } from 'src/app/interfaces/ocorrencia';
import { Parto } from 'src/app/interfaces/parto';
import { VacinacaoVermifugacao } from 'src/app/interfaces/vacinacao-vermifugacao';
import { AnimaisService } from 'src/app/services/animais.service';
import { InseminacoesService } from 'src/app/services/inseminacoes.service';
import { OcorrenciasService } from 'src/app/services/ocorrencias.service';
import { PartosService } from 'src/app/services/partos.service';
import { VacinacoesService } from 'src/app/services/vacinacoes.service';
import { VacinasService } from 'src/app/services/vacinas.service';
import { vacinaVermifugo } from 'src/app/utils/enums';
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
  inseminacoes: Inseminacao[] = [];
  partos: Parto[] = [];
  vacinacoes: VacinacaoVermifugacao[] = [];
  vermifugacoes: VacinacaoVermifugacao[] = [];
  ocorrencias: Ocorrencia[] = [];

  constructor(
    private _inseminacoesService: InseminacoesService,
    private _partosService: PartosService,
    private _vacinacoesService: VacinacoesService,
    private _vacinasService: VacinasService,
    private _ocorrenciasService: OcorrenciasService,
    private _animaisService: AnimaisService,
    public dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getInseminacoes(this.data);
    this.getPartos(this.data);
    this.getVacinacoes(this.data);
    this.getVermifugacoes(this.data);
  }

  getInseminacoes(animal: Animal):void {
    let params = {
      id_animal: animal.id
    };
    this._inseminacoesService.getInseminacoes(params).pipe().subscribe(res => {
      this.inseminacoes = res.rows;
      this.getInseminacaoById(res.rows);
    })
  }

  getPartos(animal: Animal):void {
    let params = {
      id_mae: animal.id
    };
    this._partosService.getPartos(params).pipe().subscribe(res => {
      this.partos = res.rows;
      this.getPartoById(res.rows);
    })
  }

  getVacinacoes(animal: Animal):void {
    let params = {
      id_animal: animal.id,
      tipo: vacinaVermifugo.Vacina

    };
    this._vacinacoesService.getVacinacoes(params).pipe().subscribe(res => {
      this.vacinacoes = res.rows;
      this.getVacinacaoById(res.rows);
    })
  }

  getVermifugacoes(animal: Animal):void {
    let params = {
      id_animal: animal.id,
      tipo: vacinaVermifugo.Vermifugo
    };
    this._vacinacoesService.getVacinacoes(params).pipe().subscribe(res => {
      this.vermifugacoes = res.rows;
      this.getVermifugacaoById(res.rows);
    })
  }

  getInseminacaoById(inseminacoes: Inseminacao[]): void {
    inseminacoes.forEach((inseminacao, index) => {
      this._animaisService.getAnimalById(inseminacao.id_reprodutor).subscribe(res => {
        inseminacoes[index] = Object.assign(inseminacoes[index], {
          reprodutor: res.rows[0]
        });
        this.inseminacoes = inseminacoes;
      });
    })
  }

  getPartoById(partos: Parto[]): void {
    partos.forEach((parto, index) => {
      this._animaisService.getAnimalById(parto.id_reprodutor).subscribe(res => {
        partos[index] = Object.assign(partos[index], {
          reprodutor: res.rows[0]
        });
        this.partos = partos;
      });
    })
  }

  getVacinacaoById(vacinacoes: VacinacaoVermifugacao[]): void {
    vacinacoes.forEach((vacinacao, index) => {
      this._vacinasService.getVacinaById(vacinacao.id_vacina).subscribe(res => {
        vacinacoes[index] = Object.assign(vacinacoes[index], {
          vacina_vermifugo: res.rows[0],
          doses: res.rows[0].doses ? `de ${res.rows[0].doses}` : null
        });
        this.vacinacoes = vacinacoes;
      });
    })
  }

  getVermifugacaoById(vermifugacoes: VacinacaoVermifugacao[]): void {
    vermifugacoes.forEach((vermifugacao, index) => {
      this._vacinasService.getVacinaById(vermifugacao.id_vacina).subscribe(res => {
        vermifugacoes[index] = Object.assign(vermifugacoes[index], {
          vacina_vermifugo: res.rows[0],
          doses: res.rows[0].doses ? `de ${res.rows[0].doses}` : null
        });
        this.vermifugacoes = vermifugacoes;
      });
    })
  }

  editInseminacao(element: any): void {
    element = {
      ...element,
      animal: this.data
    }
    const ref = this.dialogService.open(CadastroInseminacaoComponent, {
      data: element,
      header: `Editar Inseminação`,
      width: '80%'
    })
    .onClose.subscribe(() => {
      this.getInseminacoes(this.data)
    });
  }

  editParto(element: any): void {
    element = {
      ...element,
      animal: this.data
    }
    const ref = this.dialogService.open(CadastroPartoComponent, {
      data: element,
      header: `Editar Parto`,
      width: '80%'
    })
    .onClose.subscribe(() => {
      this.getPartos(this.data)
    });
  }

  editVacinacao(element: any): void {
    element = {
      ...element,
      animal: this.data
    }
    const ref = this.dialogService.open(CadastroVacinacaoComponent, {
      data: element,
      header: `Editar Vacinação/Vermifugação`,
      width: '80%'
    })
    .onClose.subscribe(() => {
      this.getVacinacoes(this.data);
      this.getVermifugacoes(this.data);
    });
  }

  deleteInseminacao(id: number): void {
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

  deleteParto(id: number): void {
    this._confirmationService.confirm({
      message: 'Deseja deletar o registro?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this._partosService.deleteParto(id).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this.getPartos(this.data);
        },
        err => this._messageService.add({severity:'error', detail: err.error.message}))
      }
    });
  }

  deleteVacinacao(id: number): void {
    this._confirmationService.confirm({
      message: 'Deseja deletar o registro?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this._vacinacoesService.deleteVacinacao(id).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this.getVacinacoes(this.data);
        },
        err => this._messageService.add({severity:'error', detail: err.error.message}))
      }
    });
  }

}
