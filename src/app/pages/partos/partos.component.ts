import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Parto } from 'src/app/interfaces/parto';
import { AnimaisService } from 'src/app/services/animais.service';
import { PartosService } from 'src/app/services/partos.service';
import { CadastroPartoComponent } from '../cadastro-parto/cadastro-parto.component';

@Component({
    selector: 'app-partos',
    templateUrl: './partos.component.html',
    styleUrls: ['./partos.component.scss'],
    providers: [DialogService, ConfirmationService, MessageService],
    standalone: false
})
export class PartosComponent implements OnInit, OnDestroy {

  partos: Parto[] = [];
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private _partosService: PartosService,
    private _animaisService: AnimaisService,
    public dialogService: DialogService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    this.getPartos();
    this.updateData();
  }

  updateData(): void {
    this._partosService.partosUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.getPartos();
    });
  }

  getPartos():void {
    let params = {}
    this._partosService.getPartos(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.partos = res.rows;
      this.getDataById(res.rows);
    })
  }

  getDataById(partos: Parto[]): void {
    partos.forEach((parto, index) => {
      this._animaisService.getAnimalById(parto.id_mae).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        partos[index] = Object.assign(partos[index], {
          mae: res.rows[0]
        });
        this.partos = partos;
      });
    });
    partos.forEach((parto, index) => {
      this._animaisService.getAnimalById(parto.id_reprodutor).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        partos[index] = Object.assign(partos[index], {
          reprodutor: res.rows[0]
        });
        this.partos = partos;
      });
    })
  }

  edit(element: any): void {
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

  delete(id: number): void {
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

  include(): void {
    const ref = this.dialogService.open(CadastroPartoComponent, {
      data: { },
      header: `Novo Parto`,
      width: '80%'
    })
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._partosService.triggerPartosUpdate();
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
