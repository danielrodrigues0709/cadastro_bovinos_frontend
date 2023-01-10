import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Animal } from 'src/app/interfaces/animal';
import { Parto } from 'src/app/interfaces/parto';
import { AnimaisService } from 'src/app/services/animais.service';
import { PartosService } from 'src/app/services/partos.service';
import { rebanho, sexo } from 'src/app/utils/enums';
import { dateToStr, strToDate } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-parto',
  templateUrl: './cadastro-parto.component.html',
  styleUrls: ['./cadastro-parto.component.scss']
})
export class CadastroPartoComponent implements OnInit {

  parto!: Parto;
  animal!: Animal;
  editMode!: boolean;
  form!: FormGroup;
  maesOptions: any[] = [];
  reprodutoresOptions: any[] = [];
  sexo: any[] = [{label: 'Fêmea', value: 0}, {label: 'Macho', value: 1}];
  changed: boolean = false;
  vivo: boolean = true;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private _partoService: PartosService,
    private _animaisService: AnimaisService,
    private _messageService: MessageService
  ) {
    this.parto = this.config.data;
    this.editMode = this.parto.id ? false : true;

    this.createform();
  }

  ngOnInit(): void {
    this.setFormValues(this.parto);
    this.parto.id ? this.form.disable() : this.form.enable();
    if(this.parto.id && this.parto.id_cria) {
      this._animaisService.getAnimalById(this.parto.id_cria).subscribe(res => {
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
      this.maesOptions = res.rows;
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
      data_parto: ['', Validators.required],
      vivo: [this.vivo],
      nro_controle_cria: [''],
      nome_cria: [''],
      reprodutor: ['', Validators.required],
      mae: ['', Validators.required],
      sexo: ['']
    })
  }

  setFormValues(element: any): void {
    this.form.patchValue({
      data_parto: element?.id ? dateToStr(element.data_parto) : '',
      nro_controle_cria: element?.nro_controle_cria,
      nome_cria: element?.nome_cria,
      reprodutor: element?.reprodutor,
      mae: element?.mae,
      sexo: element?.sexo
    })
  }

  toggle(event: any): void {
    this.vivo = event.checked;
    if(this.vivo) {
      this.form.get('nro_controle_cria')?.enable();
      this.form.get('nome_cria')?.enable();
      this.form.get('sexo')?.enable();
    }
    else {
      this.form.get('nro_controle_cria')?.disable();
      this.form.get('nome_cria')?.disable();
      this.form.get('sexo')?.disable();
    }
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
        ...this.parto,
        data_parto: dateToStr(this.parto.data_parto),
        vivo: true
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
    
    if(this.vivo) {
      this.saveAnimal(formValue);
    }
    else {
      this.saveParto();
    }
  }

  saveAnimal(formValues: any): void {
    let cria = {
      ...formValues,
      nome_animal: formValues.nome_cria,
      data_nascimento: this.changed ? formValues.data_parto : strToDate(formValues.data_parto),
      id_mae: formValues.mae.id,
      id_reprodutor: formValues.reprodutor.id,
      nro_controle: formValues.nro_controle_cria,
      matriz: null,
      rebanho: 1,
      registrado: 0,
      producao: 0,
    };
    
    if(this.animal?.id) {
      this._animaisService.updateAnimal(this.animal.id, cria).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.animal = res.data.rows[0];
        this.saveParto(this.animal);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._animaisService.saveAnimal(cria).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.animal = res.data.rows[0];
        this.saveParto(this.animal);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
  }

  saveParto(animal?: Animal):  void {
    let formValues = this.form.getRawValue();
    let parto = {
      ...formValues,
      id_cria: animal?.id,
      nome_cria: animal?.id ? formValues.nome_cria : "",
      nro_controle_cria: animal?.id ? formValues.nro_controle_cria : null,
      sexo: animal?.id ? formValues.sexo : null,
      id_mae: formValues.mae?.id,
      id_reprodutor: formValues.reprodutor?.id,
      data_parto: this.changed ? formValues.data_parto : strToDate(formValues.data_parto)
    }
    if(this.parto.id) {
      this._partoService.updateParto(this.parto.id, parto).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._partoService.saveParto(parto).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
  }

}
