import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { VacinaVermifugo } from 'src/app/interfaces/vacina-vermifugo';
import { VacinasService } from 'src/app/services/vacinas.service';
import { vacinaVermifugo } from 'src/app/utils/enums';
import { CadastroVacinaComponent } from '../cadastro-vacina/cadastro-vacina.component';

@Component({
  selector: 'app-vacinas',
  templateUrl: './vacinas.component.html',
  styleUrls: ['./vacinas.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class VacinasComponent implements OnInit {

  vacinas: VacinaVermifugo[] = [];
  vermifugos: VacinaVermifugo[] = [];

  constructor(
    private _vacinasService: VacinasService,
    public dialogService: DialogService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    this.getVacinas();
    this.getVermifugos();
  }

  getVacinas():void {
    let params = {
      tipo: vacinaVermifugo.Vacina,
    }
    this._vacinasService.getVacinas(params).pipe().subscribe(res => {
      this.vacinas = res.rows;
    });
  }

  getVermifugos():void {
    let params = {
      tipo: vacinaVermifugo.Vermifugo,
    }
    this._vacinasService.getVacinas(params).pipe().subscribe(res => {
      this.vermifugos = res.rows;
    });
  }

  edit(element: any): void {
    const ref = this.dialogService.open(CadastroVacinaComponent, {
      data: element,
      header: `Editar Vacina/Vermífugo`,
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
        this._vacinasService.deleteVacina(id).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this.getVacinas();
          this.getVermifugos();
        },
        err => this._messageService.add({severity:'error', detail: err.error.message}))
      }
    });
  }

  include(): void {
    const ref = this.dialogService.open(CadastroVacinaComponent, {
      data: { },
      header: `Nova Vacina/Vermífugo`,
      width: '90%'
    });
  }

}
