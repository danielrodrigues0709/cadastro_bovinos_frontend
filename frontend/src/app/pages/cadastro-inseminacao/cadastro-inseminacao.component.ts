import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Animal } from 'src/app/interfaces/animal';
import { Inseminacao } from 'src/app/interfaces/inseminacao';
import { AnimaisService } from 'src/app/services/animais.service';
import { InseminacoesService } from 'src/app/services/inseminacoes.service';
import { rebanho, sexo } from 'src/app/utils/enums';
import { dateToStr, strToDate } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-inseminacao',
  templateUrl: './cadastro-inseminacao.component.html',
  styleUrls: ['./cadastro-inseminacao.component.scss']
})
export class CadastroInseminacaoComponent implements OnInit {

  inseminacao!: Inseminacao;
  animal!: Animal;
  editMode!: boolean;
  form!: FormGroup;
  animaisOptions: any[] = [];
  reprodutoresOptions: any[] = [];
  changedIns: boolean = false;
  changedPrev: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private _inseminacoesService: InseminacoesService,
    private _animaisService: AnimaisService,
    private _messageService: MessageService
  ) {
    this.inseminacao = this.config.data;
    this.editMode = this.inseminacao.id ? false : true;

    this.createform();
  }

  ngOnInit(): void {
    this.setFormValues(this.inseminacao);
    this.inseminacao.id ? this.form.disable() : this.form.enable();
    if(this.inseminacao.id) {
      this._animaisService.getAnimalById(this.inseminacao.id_animal).subscribe(res => {
        this.animal = res.rows[0];
      })
    }
    this.autocompleteMae();
    this.autocompleteReprodutor();
  }

  autocompleteMae(event?: any): void {
    let params: any = {};
    params.nomeAnimal = event ? event?.query : "";
    params.sexo = sexo.FEMEA;
    params.rebanho = rebanho.SIM;
    this._animaisService.getAnimais(params).subscribe(res => {
      this.animaisOptions = res.rows;
    })
  }

  autocompleteReprodutor(event?: any): void {
    let params: any = {};
    params.nomeAnimal = event ? event?.query : "";
    params.sexo = sexo.MACHO;
    this._animaisService.getAnimais(params).subscribe(res => {
      this.reprodutoresOptions = res.rows;
    })
  }

  createform(): void {
    this.form = this._fb.group({
      data_inseminacao: ['', Validators.required],
      data_previsao_parto: ['', Validators.required],
      animal: ['', Validators.required],
      reprodutor: ['', Validators.required]
    })
  }

  setFormValues(element: any): void {
    this.form.patchValue({
      data_inseminacao: element?.id ? dateToStr(element.data_inseminacao) : '',
      data_previsao_parto: element?.id ? dateToStr(element.data_previsao_parto) : '',
      animal: element.animal ,
      reprodutor: element.reprodutor
    })
  }

  edit(): void {
    this.editMode = true;
    this.form.enable();
    this.form.get('nro_controle_cria')?.disable();
  }

  cancel(goBack: boolean): void {
    if(goBack) {
      this.ref.close();
    }
    else {
      this.form.patchValue({
        ...this.inseminacao,
        data_inseminacao: dateToStr(this.inseminacao.data_inseminacao),
        data_previsao_parto: dateToStr(this.inseminacao.data_previsao_parto)
      });
      this.editMode = false;
      this.form.disable();
    }
  }

  submit(): void {
    let formValues = this.form.getRawValue();
    let params = {
      ...formValues,
      data_inseminacao: this.changedIns ? formValues.data_inseminacao : strToDate(formValues.data_inseminacao),
      data_previsao_parto: this.changedPrev ? formValues.data_previsao_parto : strToDate(formValues.data_previsao_parto),
      id_animal: formValues.animal.id,
      id_reprodutor: formValues.reprodutor.id,
    }
    
    if(this.inseminacao.id) {
      this._inseminacoesService.updateInseminacao(this.inseminacao.id, params).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._inseminacoesService.saveInseminacao(params).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
  }

}
