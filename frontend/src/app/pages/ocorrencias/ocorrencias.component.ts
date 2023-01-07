import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Ocorrencia } from 'src/app/interfaces/ocorrencia';
import { AnimaisService } from 'src/app/services/animais.service';
import { MedicamentosService } from 'src/app/services/medicamentos.service';
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
    private _animaisService: AnimaisService,
    private _medicamentosService: MedicamentosService,
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
      id_medicamento: null,
      morte: null
    }
    this._ocorrenciasService.getOcorrencias(params).pipe().subscribe(res => {
      this.ocorrencias = res.rows;
      this.getDataById(res.rows);
    })
  }

  getDataById(ocorrencias: Ocorrencia[]): void {
    ocorrencias.forEach((ocorrencia, index) => {
      this._animaisService.getAnimalById(ocorrencia.id_animal).subscribe(res => {
        ocorrencias[index] = Object.assign(ocorrencias[index], {
          animal: res.rows[0]
        });
        this.ocorrencias = ocorrencias;
      });
      if(ocorrencia.id_medicamento) {
        this._medicamentosService.getMedicamentosById(ocorrencia.id_medicamento).subscribe(res => {
          ocorrencias[index] = Object.assign(ocorrencias[index], {
            medicamento: res.rows[0]
          });
          this.ocorrencias = ocorrencias;
        });
      }
    })
  }

  edit(element: any): void {
    const ref = this.dialogService.open(CadastroOcorrenciaComponent, {
      data: element,
      header: `Editar Ocorrência`,
      width: '80%'
    })
    .onClose.subscribe(() => {
      this.getOcorrencias();
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
      width: '80%'
    })
    .onClose.subscribe(() => {
      this.getOcorrencias();
    });
  }

}
