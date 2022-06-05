import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Ocorrencia } from 'src/app/interfaces/ocorrencia';
import { OcorrenciasService } from 'src/app/services/ocorrencias.service';
import { CadastroOcorrenciaComponent } from '../cadastro-ocorrencia/cadastro-ocorrencia.component';

@Component({
  selector: 'app-ocorrencias',
  templateUrl: './ocorrencias.component.html',
  styleUrls: ['./ocorrencias.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class OcorrenciasComponent implements OnInit {

  ocorrencias: Ocorrencia[] = [];

  constructor(
    private _ocorrenciasService: OcorrenciasService,
    public dialogService: DialogService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    this.getOcorrencias();
  }

  getOcorrencias():void {
    let params = {
      id_animal: null,
      id_medicamento: null
    }
    this._ocorrenciasService.getOcorrencias(params).pipe().subscribe(res => {
      this.ocorrencias = res.rows;

      console.log(this.ocorrencias.length)
    })
  }

  edit(element: any): void {
    const ref = this.dialogService.open(CadastroOcorrenciaComponent, {
      data: element,
      header: `Editar Ocorrência`,
      width: '90%'
    });
  }

  delete(id: number): void {
    this._confirmationService.confirm({
      message: 'Deseja deletar o registro?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this._ocorrenciasService.deleteOcorrencia(id).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this.getOcorrencias();
        },
        err => this._messageService.add({severity:'error', detail: err.error.message}))
      }
    });
  }

  include(): void {
    const ref = this.dialogService.open(CadastroOcorrenciaComponent, {
      data: { },
      header: `Nova Ocorrência`,
      width: '90%'
    });
  }

}
