import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Medicamento } from 'src/app/interfaces/Medicamento';
import { MedicamentosService } from 'src/app/services/medicamentos.service';
import { CadastroMedicamentoComponent } from '../cadastro-medicamento/cadastro-medicamento.component';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class MedicamentosComponent implements OnInit {

  medicamentos: Medicamento[] = [];

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
  }

  getMedicamentos():void {
    this._medicamentosService.getMedicamentos().pipe().subscribe(res => {
      this.medicamentos = res.rows;
    });
  }

  edit(element: any): void {
    const ref = this.dialogService.open(CadastroMedicamentoComponent, {
      data: element,
      header: `Editar Medicamento`,
      width: '90%'
    })
    .onClose.subscribe(() => {
      this.getMedicamentos();
    });
  }

  delete(id: number): void {
    this._confirmationService.confirm({
      message: 'Deseja deletar o registro?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this._medicamentosService.deleteMedicamento(id).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this.getMedicamentos();
        },
        err => this._messageService.add({severity:'error', detail: err.error.message}))
      }
    });
  }

  include(): void {
    const ref = this.dialogService.open(CadastroMedicamentoComponent, {
      data: { },
      header: `Novo Medicamento`,
      width: '90%'
    })
    .onClose.subscribe(() => {
      this.getMedicamentos();
    });
  }

}
