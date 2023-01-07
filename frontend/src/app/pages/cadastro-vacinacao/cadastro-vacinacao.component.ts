import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VacinacaoVermifugacao } from 'src/app/interfaces/vacinacao-vermifugacao';
import { AnimaisService } from 'src/app/services/animais.service';
import { VacinacoesService } from 'src/app/services/vacinacoes.service';
import { VacinasService } from 'src/app/services/vacinas.service';

@Component({
  selector: 'app-cadastro-vacinacao',
  templateUrl: './cadastro-vacinacao.component.html',
  styleUrls: ['./cadastro-vacinacao.component.scss']
})
export class CadastroVacinacaoComponent implements OnInit {

  vacinacao_vermifugacao!: VacinacaoVermifugacao;
  editMode!: boolean;
  form!: FormGroup;
  tipoOptions: any[] = [{label: 'Vacinação', value: 0}, {label: 'Vermífugação', value: 1}];
  tipo!: number;
  animaisOptions: any[] = [];
  vacinas_vermifugosOptions: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private _vacinacoesService: VacinacoesService,
    private _animalService: AnimaisService,
    private _vacinasService: VacinasService,
    private _messageService: MessageService
  ) {
    this.vacinacao_vermifugacao = this.config.data;
    this.editMode = this.vacinacao_vermifugacao.id ? false : true;

    this.createform();
  }

  ngOnInit(): void {
    this.setFormValues(this.vacinacao_vermifugacao);
    this.vacinacao_vermifugacao.id ? this.form.disable() : this.form.enable();
    this.autocompleteAnimal();
    this.form.get('vacina_vermifugo')?.disable();
  }

  autocompleteAnimal(event?: any): void {
    let params: any = {};
    params.nomeAnimal = event ? event?.query : "";
    this._animalService.getAnimais(params).subscribe(res => {
      this.animaisOptions = res.rows;
    })
  }

  onSelectTipo(event: any): void {
    this.tipo = event?.value;
    this.autocompleteVacinaVermifugo();
    this.form.get('vacina_vermifugo')?.enable();
  }

  autocompleteVacinaVermifugo(event?: any): void {
    let params: any = {};
    params.vacina_vermifugo = event ? event?.query : "";
    params.tipo = this.tipo;
    this._vacinasService.getVacinas(params).subscribe(res => {
      this.vacinas_vermifugosOptions = res.rows;
    })
  }

  createform(): void {
    this.form = this._fb.group({
      tipo: ['', Validators.required],
      data_vacinacao: ['', Validators.required],
      animal: ['', Validators.required],
      vacina_vermifugo: ['', Validators.required],
      dose: ['', Validators.required],
    })
  }

  setFormValues(element: any): void {
    let data_formatada = element?.data_vacinacao ? formatDate(
      new Date(element.data_vacinacao).toISOString(),'short','pt-BR','GMT-0') : '';
    this.form.patchValue({
      data_vacinacao: data_formatada,
      animal: element?.animal,
      vacina_vermifugo: element?.vacina_vermifugo,
      dose: element?.dose,
      tipo: element?.tipo
    });
    this.onSelectTipo(this.form.get('tipo')?.value);
  }

  edit(): void {
    this.editMode = true;
    this.form.enable();
  }

  cancel(goBack: boolean): void {
    if(goBack) {
      this.ref.close();
    }
    else {
      this.form.patchValue({
        ...this.vacinacao_vermifugacao
      });
      this.editMode = false;
      this.form.disable();
    }
  }

  submit(): void {
    if(!this.form.valid) {
      return;
    }
    let formValue = this.form.getRawValue();
    let params = { 
      ...formValue,
      id_animal: formValue.animal.id,
      id_vacina: formValue.vacina_vermifugo.id
    }
    
    if(this.vacinacao_vermifugacao.id) {
      this._vacinacoesService.updateVacinacao(this.vacinacao_vermifugacao.id, params).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._vacinacoesService.saveVacinacao(params).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
  }

}
