import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { VacinaVermifugo } from 'src/app/interfaces/vacina-vermifugo';
import { VacinacaoVermifugacao } from 'src/app/interfaces/vacinacao-vermifugacao';
import { AnimaisService } from 'src/app/services/animais.service';
import { VacinacoesService } from 'src/app/services/vacinacoes.service';
import { VacinasService } from 'src/app/services/vacinas.service';
import { vacinaVermifugo } from 'src/app/utils/enums';
import { CadastroVacinacaoComponent } from '../cadastro-vacinacao/cadastro-vacinacao.component';

@Component({
  selector: 'app-vacinacoes',
  templateUrl: './vacinacoes.component.html',
  styleUrls: ['./vacinacoes.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class VacinacoesComponent implements OnInit, OnDestroy {

  vacinacoes: VacinacaoVermifugacao[] = [];
  vermifugacoes: VacinacaoVermifugacao[] = [];
  vacinas: VacinaVermifugo[] = [];
  vermifugas: VacinaVermifugo[] = [];
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private _vacinacoesService: VacinacoesService,
    private _animaisService: AnimaisService,
    private _vacinasService: VacinasService,
    public dialogService: DialogService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    this.getVacinacoes();
    this.getVermifugacoes();
    this.updateData();
  }

  updateData(): void {
    this._vacinacoesService.vacinacoesUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.getVacinacoes();
      this.getVermifugacoes();
    });
  }

  getVacinacoes():void {
    let params = {
      tipo: vacinaVermifugo.VACINA,
    }
    this._vacinacoesService.getVacinacoes(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.vacinacoes = res.rows;
      this.getDataById(res.rows, true);
    });
  }

  getVermifugacoes():void {
    let params = {
      tipo: vacinaVermifugo.VERMIFUGO,
    }
    this._vacinacoesService.getVacinacoes(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.vermifugacoes = res.rows;
      this.getDataById(res.rows, false);
    });
  }

  getDataById(vacinacoes: VacinacaoVermifugacao[], vacinacao: boolean): void {
    vacinacoes.forEach((vac, index) => {
      this._animaisService.getAnimalById(vac.id_animal).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        vacinacoes[index] = Object.assign(vacinacoes[index], {
          animal: res.rows[0]
        });
        vacinacao ? this.vacinacoes = vacinacoes : this.vermifugacoes = vacinacoes;
      });
    });
    vacinacoes.forEach((vac, index) => {
      this._vacinasService.getVacinaById(vac.id_vacina).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        vacinacoes[index] = Object.assign(vacinacoes[index], {
          vacina_vermifugo: res.rows[0],
          doses: res.rows[0].doses ? `de ${res.rows[0].doses}` : null
        });
        vacinacao ? this.vacinacoes = vacinacoes : this.vermifugacoes = vacinacoes;
      });
    });
  }

  edit(element: any): void {
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

  delete(id: number): void {
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

  include(): void {
    const ref = this.dialogService.open(CadastroVacinacaoComponent, {
      data: { },
      header: `Nova Vacinação/Vermifugação`,
      width: '80%'
    })
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._vacinacoesService.triggerVacinacoesUpdate();
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
