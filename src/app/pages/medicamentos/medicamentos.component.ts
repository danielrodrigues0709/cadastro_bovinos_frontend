import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Medicamento } from 'src/app/interfaces/medicamento';
import { MedicamentosService } from 'src/app/services/medicamentos.service';
import { CadastroMedicamentoComponent } from '../cadastro-medicamento/cadastro-medicamento.component';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class MedicamentosComponent implements OnInit, OnDestroy {

  medicamentos: Medicamento[] = [];
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private _medicamentosService: MedicamentosService,
    public dialogService: DialogService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    this.getMedicamentos();
    this.updateData();
  }

  updateData(): void {
    this._medicamentosService.medicamentosUpdated.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.getMedicamentos();
    });
  }

  getMedicamentos():void {
    let params = {};
    this._medicamentosService.getMedicamentos(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.medicamentos = res.rows;
    });
  }

  edit(element: any): void {
    const ref = this.dialogService.open(CadastroMedicamentoComponent, {
      data: element,
      header: `Editar Medicamento`,
      width: '80%'
    })
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._medicamentosService.triggerMedicamentosUpdate();
    });
  }

  delete(id: number): void {
    this._confirmationService.confirm({
      message: 'Deseja deletar o registro?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this._medicamentosService.deleteMedicamento(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this._medicamentosService.triggerMedicamentosUpdate();
        },
        err => this._messageService.add({severity:'error', detail: err.error.message}))
      }
    });
  }

  include(): void {
    const ref = this.dialogService.open(CadastroMedicamentoComponent, {
      data: { },
      header: `Novo Medicamento`,
      width: '80%'
    })
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._medicamentosService.triggerMedicamentosUpdate();
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
