import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { producao, rebanho, sexo } from 'src/app/utils/enums';
import { AnimaisService } from 'src/app/services/animais.service';
import { Animal } from '../../interfaces/animal';
import { CadastroOcorrenciaComponent } from '../cadastro-ocorrencia/cadastro-ocorrencia.component';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-plantel',
  templateUrl: './plantel.component.html',
  styleUrls: ['./plantel.component.scss'],
  providers: [DialogService, ConfirmationService, MessageService]
})
export class PlantelComponent implements OnInit {

  matrizProducao: Animal[] = [];
  matrizDescanso: Animal[] = [];
  reprodutores: Animal[] = [];

  constructor(
    private _animaisService: AnimaisService,
    public dialogService: DialogService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    this.getMatrizProducao();
    this.getMatrizDescanso();
    this.getReprodutores();
    this.updateData();
  }

  updateData(): void {
    this._animaisService.animaisUpdated.pipe().subscribe(() => {
      this.getMatrizProducao();
      this.getMatrizDescanso();
      this.getReprodutores();
    });
  }

  getDataById(animais: Animal[], matriz: string): void {
    animais.forEach((animal, index) => {
      if(animal.id_mae) {
        this._animaisService.getAnimalById(animal.id_mae).subscribe(res => {
          animais[index] = Object.assign(animais[index], {
            mae: res.rows[0]
          });
          if(matriz == 'matrizProducao') this.matrizProducao = animais;
          if(matriz == 'matrizDescanso') this.matrizDescanso = animais;
        });
      }
    });
    animais.forEach((animal, index) => {
      if(animal.id_reprodutor) {
        this._animaisService.getAnimalById(animal.id_reprodutor).subscribe(res => {
          animais[index] = Object.assign(animais[index], {
            reprodutor: res.rows[0]
          });
          if(matriz == 'reprodutores') this.reprodutores = animais;
        });
      }
    });
  }

  getMatrizProducao():void {
    let params = {
      sexo: sexo.FEMEA,
      producao: producao.SIM,
      rebanho: rebanho.SIM,
    }
    this._animaisService.getAnimais(params).pipe().subscribe(res => {
      this.matrizProducao = res.rows;
      this.getDataById(res.rows, "matrizProducao");
    });
  }

  getMatrizDescanso():void {
    let params = {
      sexo: sexo.FEMEA,
      producao: producao.NAO,
      rebanho: rebanho.SIM,
    }
    this._animaisService.getAnimais(params).pipe().subscribe(res => {
      this.matrizDescanso = res.rows;
      this.getDataById(res.rows, "matrizDescanso");
    });
  }

  getReprodutores():void {
    let params = {
      sexo: sexo.MACHO,
    }
    this._animaisService.getAnimais(params).pipe().subscribe(res => {
      this.reprodutores = res.rows;
      this.getDataById(res.rows, "reprodutores");
    });
  }

  edit(element: any): void {
    this.router.navigate(['../animais/cadastro'], {state: {element: element}});
  }

  delete(id: number): void {
    this._confirmationService.confirm({
      message: 'Deseja deletar o registro?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-outlined',
      accept: () => {
        this._animaisService.deleteAnimal(id).subscribe(res => {
          this._messageService.add({severity:'success', detail: res.message});
          this._animaisService.triggerAnimaisUpdate();
        },
        err => this._messageService.add({severity:'error', detail: err.error.message}))
      }
    });
  }

  include(): void {
    this.router.navigate(['../animais/cadastro']);
  }

  ocorrencia(mode: string): void {
    const ref = this.dialogService.open(CadastroOcorrenciaComponent, {
      data: { },
      header: `${mode} Ocorrência`,
      width: '80%'
    })
    .onClose.subscribe(() => {
      this._animaisService.triggerAnimaisUpdate();
    });
  }

}
