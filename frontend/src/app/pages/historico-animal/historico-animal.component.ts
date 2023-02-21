import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Animal } from 'src/app/interfaces/animal';
import { Inseminacao } from 'src/app/interfaces/inseminacao';
import { Ocorrencia } from 'src/app/interfaces/ocorrencia';
import { Parto } from 'src/app/interfaces/parto';
import { VacinacaoVermifugacao } from 'src/app/interfaces/vacinacao-vermifugacao';
import { AnimaisService } from 'src/app/services/animais.service';
import { InseminacoesService } from 'src/app/services/inseminacoes.service';
import { MedicamentosService } from 'src/app/services/medicamentos.service';
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
export class HistoricoAnimalComponent implements OnInit, OnDestroy {

  @Input() data!: Animal;
  inseminacoes: Inseminacao[] = [];
  partos: Parto[] = [];
  vacinacoes: VacinacaoVermifugacao[] = [];
  vermifugacoes: VacinacaoVermifugacao[] = [];
  ocorrencias: Ocorrencia[] = [];
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private _inseminacoesService: InseminacoesService,
    private _partosService: PartosService,
    private _vacinacoesService: VacinacoesService,
    private _vacinasService: VacinasService,
    private _ocorrenciasService: OcorrenciasService,
    private _animaisService: AnimaisService,
    private _medicamentosService: MedicamentosService,
    public dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit(): void {
    if(this.data.sexo == 0) {
      this.getInseminacoes(this.data);
      this.getPartos(this.data);
    };
    this.getVacinacoes(this.data);
    this.getVermifugacoes(this.data);
    this.getOcorrencias(this.data);
    this.updateData();
  }

  updateData(): void {
    if(this.data.sexo == 0) {
      this._inseminacoesService.inseminacoesUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.getInseminacoes(this.data);
      });
      this._partosService.partosUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.getPartos(this.data);
      });
    };
    this._vacinacoesService.vacinacoesUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.getVacinacoes(this.data);
      this.getVermifugacoes(this.data);
    });
    this._ocorrenciasService.ocorrenciasUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.getOcorrencias(this.data);
    });
  }

  getInseminacoes(animal: Animal):void {
    let params = {
      id_animal: animal.id
    };
    this._inseminacoesService.getInseminacoes(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.inseminacoes = res.rows;
      this.getInseminacaoById(res.rows);
    })
  }

  getPartos(animal: Animal):void {
    let params = {
      id_mae: animal.id
    };
    this._partosService.getPartos(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.partos = res.rows;
      this.getPartoById(res.rows);
    })
  }

  getVacinacoes(animal: Animal):void {
    let params = {
      id_animal: animal.id,
      tipo: vacinaVermifugo.VACINA

    };
    this._vacinacoesService.getVacinacoes(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.vacinacoes = res.rows;
      this.getVacinacaoById(res.rows);
    })
  }

  getVermifugacoes(animal: Animal):void {
    let params = {
      id_animal: animal.id,
      tipo: vacinaVermifugo.VERMIFUGO
    };
    this._vacinacoesService.getVacinacoes(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.vermifugacoes = res.rows;
      this.getVermifugacaoById(res.rows);
    })
  }

  getOcorrencias(animal: Animal):void {
    let params = {
      id_animal: animal.id
    };
    this._ocorrenciasService.getOcorrencias(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.ocorrencias = res.rows;
      this.getOcorrenciaById(res.rows);
    })
  }

  getInseminacaoById(inseminacoes: Inseminacao[]): void {
    inseminacoes.forEach((inseminacao, index) => {
      this._animaisService.getAnimalById(inseminacao.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        inseminacoes[index] = Object.assign(inseminacoes[index], {
          reprodutor: res.rows[0]
        });
        this.inseminacoes = inseminacoes;
      });
    })
  }

  getPartoById(partos: Parto[]): void {
    partos.forEach((parto, index) => {
      this._animaisService.getAnimalById(parto.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        partos[index] = Object.assign(partos[index], {
          reprodutor: res.rows[0]
        });
        this.partos = partos;
      });
    })
  }

  getVacinacaoById(vacinacoes: VacinacaoVermifugacao[]): void {
    vacinacoes.forEach((vacinacao, index) => {
      this._vacinasService.getVacinaById(vacinacao.id_vacina).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
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
      this._vacinasService.getVacinaById(vermifugacao.id_vacina).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        vermifugacoes[index] = Object.assign(vermifugacoes[index], {
          vacina_vermifugo: res.rows[0],
          doses: res.rows[0].doses ? `de ${res.rows[0].doses}` : null
        });
        this.vermifugacoes = vermifugacoes;
      });
    })
  }

  getOcorrenciaById(ocorrencias: Ocorrencia[]): void {
    ocorrencias.forEach((ocorrencia, index) => {
      if(ocorrencia.id_medicamento) {
        this._medicamentosService.getMedicamentosById(ocorrencia.id_medicamento).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          ocorrencias[index] = Object.assign(ocorrencias[index], {
            medicamento: res.rows[0]
          });
          this.ocorrencias = ocorrencias;
        });
      }
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
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._inseminacoesService.triggerInseminacoesUpdate();
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
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._partosService.triggerPartosUpdate();
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
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._vacinacoesService.triggerVacinacoesUpdate();
    });
  }

  editOcorrencia(element: any): void {
    element = {
      ...element,
      animal: this.data
    }
    const ref = this.dialogService.open(CadastroOcorrenciaComponent, {
      data: element,
      header: `Editar Ocorrência`,
      width: '80%'
    })
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._ocorrenciasService.triggerOcorrenciasUpdate();
    });
  }

  deleteInseminacao(id: number): void {
    this._confirmationService.confirm({
      message: 'Deseja deletar o registro?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this._inseminacoesService.deleteInseminacao(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this._inseminacoesService.triggerInseminacoesUpdate();
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
        this._partosService.deleteParto(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this._partosService.triggerPartosUpdate();
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
        this._vacinacoesService.deleteVacinacao(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this._vacinacoesService.triggerVacinacoesUpdate();
        },
        err => this._messageService.add({severity:'error', detail: err.error.message}))
      }
    });
  }

  deleteOcorrencia(id: number): void {
    this._confirmationService.confirm({
      message: 'Deseja deletar o registro?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this._ocorrenciasService.deleteOcorrencia(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this._ocorrenciasService.triggerOcorrenciasUpdate();
        },
        err => this._messageService.add({severity:'error', detail: err.error.message}))
      }
    });
  }
  
  onSubscriptionsDestroy(ngUnsubscribe: Subject<any>): void {
    ngUnsubscribe.next(true);
	  ngUnsubscribe.complete();
	  ngUnsubscribe.unsubscribe();
	}

	ngOnDestroy(): void {
	  this.onSubscriptionsDestroy(this.ngUnsubscribe);
	}

}
