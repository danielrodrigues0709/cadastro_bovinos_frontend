import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Inseminacao } from 'src/app/interfaces/inseminacao';
import { AnimaisService } from 'src/app/services/animais.service';
import { InseminacoesService } from 'src/app/services/inseminacoes.service';
import { CadastroInseminacaoComponent } from '../cadastro-inseminacao/cadastro-inseminacao.component';

@Component({
    selector: 'app-inseminacoes',
    templateUrl: './inseminacoes.component.html',
    styleUrls: ['./inseminacoes.component.scss'],
    providers: [DialogService, ConfirmationService, MessageService],
    standalone: false
})
export class InseminacoesComponent implements OnInit, OnDestroy {

  inseminacoes: Inseminacao[] = [];
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private _inseminacoesService: InseminacoesService,
    private _animaisService: AnimaisService,
    public dialogService: DialogService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    this.getInseminacoes();
    this.updateData();
  }

  updateData(): void {
    this._inseminacoesService.inseminacoesUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.getInseminacoes();
    });
  }

  getInseminacoes():void {
    let params = {}
    this._inseminacoesService.getInseminacoes(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.inseminacoes = res.rows;
      this.getDataById(res.rows);
    })
  }

  getDataById(inseminacoes: Inseminacao[]): void {
    inseminacoes.forEach((inseminacao, index) => {
      this._animaisService.getAnimalById(inseminacao.id_animal).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        inseminacoes[index] = Object.assign(inseminacoes[index], {
          animal: res.rows[0]
        });
        this.inseminacoes = inseminacoes;
      });
    });
    inseminacoes.forEach((inseminacao, index) => {
      this._animaisService.getAnimalById(inseminacao.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        inseminacoes[index] = Object.assign(inseminacoes[index], {
          reprodutor: res.rows[0]
        });
        this.inseminacoes = inseminacoes;
      });
    })
  }

  edit(element: any): void {
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

  delete(id: number): void {
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

  include(): void {
    const ref = this.dialogService.open(CadastroInseminacaoComponent, {
      data: { },
      header: `Nova Inseminacao`,
      width: '80%'
    })
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._inseminacoesService.triggerInseminacoesUpdate();
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
