import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { VacinacaoVermifugacao } from 'src/app/interfaces/vacinacao-vermifugacao';
import { AnimaisService } from 'src/app/services/animais.service';
import { VacinacoesService } from 'src/app/services/vacinacoes.service';
import { VacinasService } from 'src/app/services/vacinas.service';
import { messages, rebanho } from 'src/app/utils/enums';
import { dateToStr, strToDate, validateFormFields } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-vacinacao',
  templateUrl: './cadastro-vacinacao.component.html',
  styleUrls: ['./cadastro-vacinacao.component.scss']
})
export class CadastroVacinacaoComponent implements OnInit, OnDestroy {

  vacinacao_vermifugacao!: VacinacaoVermifugacao;
  editMode!: boolean;
  form!: UntypedFormGroup;
  tipoOptions: any[] = [{label: 'Vacinação', value: 0}, {label: 'Vermifugação', value: 1}];
  tipo!: number;
  total!: string | null;
  animaisOptions: any[] = [];
  vacinas_vermifugosOptions: any[] = [];
  changed: boolean = false;
  subscription: Subscription = new Subscription();
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: UntypedFormBuilder,
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
    this.tipo = this.vacinacao_vermifugacao.tipo;
    this.vacinacao_vermifugacao.id ? this.form.disable() : this.form.enable();
    if(this.config.data.animal) {
      this.form.get('animal')?.disable();
    }
    this.autocompleteAnimal();
    this.autocompleteVacinaVermifugo();
    this.form.get('vacina_vermifugo')?.disable();
  }

  autocompleteAnimal(event?: any): void {
    let params: any = {};
    params.nomeAnimal = event ? event?.query : "";
    params.rebanho = rebanho.SIM;
    this._animalService.getAnimais(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.animaisOptions = res.rows;
    })
  }

  onSelectTipo(event: any, clearfields: boolean): void {
    this.tipo = event?.value;
    this.autocompleteVacinaVermifugo();
    if(clearfields) {
      this.form.get('vacina_vermifugo')?.patchValue('');
      this.form.get('dose')?.patchValue('');
      this.total = "";
    }
    this.form.get('vacina_vermifugo')?.enable();
  }

  autocompleteVacinaVermifugo(event?: any): void {
    let params: any = {};
    params.vacina_vermifugo = event ? event?.query : "";
    params.tipo = this.tipo;

    this.subscription = this._vacinasService.getVacinas(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.vacinas_vermifugosOptions = res.rows;
    });
    if(!this.tipo && this.tipo != 0) {
      this.subscription.unsubscribe();
    }
  }

  onSelectVacinaVermifugo(event: any): void {
    this.total = event?.doses ? `(Total de ${event?.doses} doses)` : null;
  }

  createform(): void {
    this.form = this._fb.group({
      tipo: ['', Validators.required],
      data_vacinacao: ['', Validators.required],
      animal: ['', Validators.required],
      vacina_vermifugo: ['', Validators.required],
      dose: [''],
    })
  }

  setFormValues(element: any): void {
    this.form.patchValue({
      data_vacinacao: element?.id ? dateToStr(element.data_vacinacao) : '',
      animal: element?.animal,
      vacina_vermifugo: element?.vacina_vermifugo,
      dose: element?.dose,
      tipo: element?.tipo
    });
    this.onSelectTipo(this.form.get('tipo')?.value, false);
    this.onSelectVacinaVermifugo(this.form.get('vacina_vermifugo')?.value);
  }

  edit(): void {
    this.editMode = true;
    this.form.enable();
  }

  cancel(goBack: boolean): void {
    if(goBack) {
      this.ref.close(false);
    }
    else {
      this.form.patchValue({
        ...this.vacinacao_vermifugacao,
        data_vacinacao: dateToStr(this.vacinacao_vermifugacao.data_vacinacao)
      });
      this.editMode = false;
      this.form.disable();
    }
  }

  submit(): void {
    if(!this.form.valid) {
      this._messageService.add({severity:'warn', detail: messages.REQUIRED});
      validateFormFields(this.form);
      return;
    }
    let formValues = this.form.getRawValue();
    let params = { 
      ...formValues,
      data_vacinacao: this.changed ? formValues.data_vacinacao : strToDate(formValues.data_vacinacao),
      id_animal: formValues.animal.id,
      id_vacina: formValues.vacina_vermifugo.id,
      dose: formValues.dose ? formValues.dose : null
    }
    
    if(this.vacinacao_vermifugacao.id) {
      this._vacinacoesService.updateVacinacao(this.vacinacao_vermifugacao.id, params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close(true);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._vacinacoesService.saveVacinacao(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close(true);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
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
