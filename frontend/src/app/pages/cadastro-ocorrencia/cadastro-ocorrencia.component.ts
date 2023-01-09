import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Ocorrencia } from 'src/app/interfaces/ocorrencia';
import { AnimaisService } from 'src/app/services/animais.service';
import { MedicamentosService } from 'src/app/services/medicamentos.service';
import { OcorrenciasService } from 'src/app/services/ocorrencias.service';
import { rebanho } from 'src/app/utils/enums';
import { booleanToNumber, dateToStr, numberToBoolean, strToDate } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-ocorrencia',
  templateUrl: './cadastro-ocorrencia.component.html',
  styleUrls: ['./cadastro-ocorrencia.component.scss']
})
export class CadastroOcorrenciaComponent implements OnInit {

  ocorrencia!: Ocorrencia;
  editMode!: boolean;
  form!: FormGroup;
  animaisOptions: any[] = [];
  medicamentosOptions: any[] = [];
  changed: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
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
    this.autocompleteAnimal();
    this.autocompleteMedicamento();
  }

  autocompleteAnimal(event?: any): void {
    let params: any = {};
    params.nomeAnimal = event ? event?.query : "";
    params.rebanho = rebanho.SIM;
    this._animalService.getAnimais(params).subscribe(res => {
      this.animaisOptions = res.rows;
    })
  }

  autocompleteMedicamento(event?: any): void {
    let params: any = {};
    params.medicamento = event ? event?.query : "";
    this._medicamentoService.getMedicamentos(params).subscribe(res => {
      this.medicamentosOptions = res.rows;
    })
  }

  onSelectAnimal(event: any): void {
    this.form.get('numControle')?.patchValue(event.nro_controle);
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
    this.form.get('numControle')?.disable();
  }

  cancel(goBack: boolean): void {
    if(goBack) {
      this.ref.close();
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
      this._animalService.updateAnimal(params.animal.id, animal).subscribe(() => {
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    this.ref.close();
  }

  submit(): void {
    if(!this.form.valid) {
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
      this._ocorrenciaService.updateOcorrencia(this.ocorrencia.id, params).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.removeAnimal(params);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._ocorrenciaService.saveOcorrencia(params).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.removeAnimal(params);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
  }

}
