import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Ocorrencia } from 'src/app/interfaces/ocorrencia';
import { AnimaisService } from 'src/app/services/animais.service';
import { MedicamentosService } from 'src/app/services/medicamentos.service';
import { OcorrenciasService } from 'src/app/services/ocorrencias.service';
import { messages, rebanho } from 'src/app/utils/enums';
import { booleanToNumber, dateToStr, numberToBoolean, strToDate, validateFormFields } from 'src/app/utils/utils';

@Component({
    selector: 'app-cadastro-ocorrencia',
    templateUrl: './cadastro-ocorrencia.component.html',
    styleUrls: ['./cadastro-ocorrencia.component.scss'],
    standalone: false
})
export class CadastroOcorrenciaComponent implements OnInit, OnDestroy {

  ocorrencia!: Ocorrencia;
  editMode!: boolean;
  form!: UntypedFormGroup;
  animaisOptions: any[] = [];
  medicamentosOptions: any[] = [];
  changed: boolean = false;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: UntypedFormBuilder,
    private _ocorrenciaService: OcorrenciasService,
    private _animalService: AnimaisService,
    private _medicamentoService: MedicamentosService,
    private _messageService: MessageService
  ) {
    this.ocorrencia = this.config.data;
    this.editMode = this.ocorrencia.id ? false : true;
    
    this.createform();
  }

  ngOnInit(): void {
    this.setFormValues(this.ocorrencia);
    this.ocorrencia.id ? this.form.disable() : this.form.enable();
    if(this.config.data.animal) {
      this.form.get('numControle')?.disable();
      this.form.get('animal')?.disable();
    }
    this.autocompleteAnimal();
    this.autocompleteMedicamento();
  }

  autocompleteAnimal(event?: any): void {
    let params: any = {};
    params.nomeAnimal = event ? event?.query : "";
    params.rebanho = rebanho.SIM;
    this._animalService.getAnimais(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.animaisOptions = res.rows;
    })
  }

  autocompleteMedicamento(event?: any): void {
    let params: any = {};
    params.medicamento = event ? event?.query : "";
    this._medicamentoService.getMedicamentos(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.medicamentosOptions = res.rows;
    })
  }

  onSelectAnimal(event: any): void {
    this.form.get('numControle')?.patchValue(event.nro_controle);
  }

  onSetNumControle(event: any): void {
    let params = {
      nro_controle: event?.target.value,
    };
    this._animalService.getAnimais(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.form.get('animal')?.patchValue(res.rows[0]);
    })
  }

  createform(): void {
    this.form = this._fb.group({
      numControle: ['', Validators.required],
      animal: ['', Validators.required],
      data_ocorrencia: ['', Validators.required],
      morte: [''],
      medicamento: [''],
      descricao: ['', Validators.required]
    })
  }

  setFormValues(element: any): void {
    this.form.patchValue({
      numControle: element?.animal?.nro_controle,
      animal: element?.animal,
      data_ocorrencia: element?.id ? dateToStr(element.data_ocorrencia) : '',
      morte: numberToBoolean(element?.morte),
      medicamento: element?.medicamento,
      descricao: element?.descricao
    })
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
        ...this.ocorrencia,
        data_ocorrencia: dateToStr(this.ocorrencia.data_ocorrencia),
        morte: numberToBoolean(this.ocorrencia.morte),
      });
      this.editMode = false;
      this.form.disable();
    }
  }

  removeAnimal(params: any): void {
    if(params.morte == 1) {
      let animal = {
        ...params.animal,
        rebanho: 0,
        producao: 0,
      };
      this._animalService.updateAnimal(params.animal.id, animal).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        this.ref.close(true);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    this.ref.close(true);
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
      data_ocorrencia: this.changed ? formValues.data_ocorrencia : strToDate(formValues.data_ocorrencia),
      id_animal: formValues.animal.id,
      id_medicamento: formValues.medicamento ? formValues.medicamento.id : null,
      morte: booleanToNumber(formValues.morte)
    }
    
    if(this.ocorrencia.id) {
      this._ocorrenciaService.updateOcorrencia(this.ocorrencia.id, params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.removeAnimal(params);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._ocorrenciaService.saveOcorrencia(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.removeAnimal(params);
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
