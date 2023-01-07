import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Inseminacao } from 'src/app/interfaces/inseminacao';
import { AnimaisService } from 'src/app/services/animais.service';
import { InseminacoesService } from 'src/app/services/inseminacoes.service';
import { CadastroInseminacaoComponent } from '../cadastro-inseminacao/cadastro-inseminacao.component';

@Component({
  selector: 'app-inseminacoes',
  templateUrl: './inseminacoes.component.html',
  styleUrls: ['./inseminacoes.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class InseminacoesComponent implements OnInit {

  inseminacoes: Inseminacao[] = [];

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
  }

  getInseminacoes():void {
    let params = {}
    this._inseminacoesService.getInseminacoes(params).pipe().subscribe(res => {
      this.inseminacoes = res.rows;
      this.getDataById(res.rows);
    })
  }

  getDataById(inseminacoes: Inseminacao[]): void {
    inseminacoes.forEach((inseminacao, index) => {
      this._animaisService.getAnimalById(inseminacao.id_animal).subscribe(res => {
        inseminacoes[index] = Object.assign(inseminacoes[index], {
          animal: res.rows[0]
        });
        this.inseminacoes = inseminacoes;
      });
    });
    inseminacoes.forEach((inseminacao, index) => {
      this._animaisService.getAnimalById(inseminacao.id_reprodutor).subscribe(res => {
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
    .onClose.subscribe(() => {
      this.getInseminacoes();
    });
  }

  delete(id: number): void {
    this._confirmationService.confirm({
      message: 'Deseja deletar o registro?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this._inseminacoesService.deleteInseminacao(id).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this.getInseminacoes();
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
    .onClose.subscribe(() => {
      this.getInseminacoes();
    });
  }

}
