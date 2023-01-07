import { Component, OnInit } from '@angular/core';
import { formatDate, Location } from '@angular/common';
import { Animal } from 'src/app/interfaces/animal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { booleanToNumber, numberToBoolean } from 'src/app/utils/utils';
import { AnimaisService } from 'src/app/services/animais.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cadastro-animal',
  templateUrl: './cadastro-animal.component.html',
  styleUrls: ['./cadastro-animal.component.scss'],
  providers: [MessageService]
})
export class CadastroAnimalComponent implements OnInit {

  state: any;
  title: string = '';
  animal: Animal;
  editMode: boolean;
  form!: FormGroup;
  sexo: any[] = [{label: 'Fêmea', value: 0}, {label: 'Macho', value: 1}];


  constructor(
    private _location: Location,
    private _fb: FormBuilder,
    private _animaisService: AnimaisService,
    private _messageService: MessageService
  ) {
    this.state = this._location.getState();
    this.animal = this.state.element;
    this.editMode = this.state.element ? false : true;
    this.title = this.state.element ? "Detalhes do" : "Novo";

    this.createform();
  }

  ngOnInit(): void {
    this.setFormValues(this.animal);
    this.animal ? this.form.disable() : this.form.enable();
  }

  createform(): void {
    this.form = this._fb.group({
      nro_controle: ['', Validators.required],
      matriz: [''],
      nome_animal: ['', Validators.required],
      sexo: ['', Validators.required],
      data_nascimento: [''],
      rebanho: ['', Validators.required],
      producao: ['', Validators.required],
      id_mae: [],
      id_reprodutor: [],
    })
  }

  setFormValues(element: any): void {
    let data_formatada = element?.data_nascimento ? formatDate(
      new Date(element.data_nascimento).toISOString(),'short','pt-BR','GMT-0') : '';
    this.form.patchValue({
      nro_controle: element?.nro_controle,
      matriz: element?.matriz,
      nome_animal: element?.nome_animal,
      sexo: element?.sexo,
      data_nascimento: element.id ? data_formatada : '',
      rebanho: element ? numberToBoolean(element?.rebanho) : true,
      producao: element ? numberToBoolean(element.producao) : true,
      // id_mae: element.
      // id_reprodutor: element.
    })
  }

  disableInput(): boolean {
    return this.form.controls['sexo'].value !== 0
  }

  edit(): void {
    this.editMode = true;
    this.form.enable();
    this.disableInput() ? this.form.get('producao')?.disable() : null;
  }

  cancel(goBack: boolean): void {
    if(goBack) {
      history.back();
    }
    else {
      let data_formatada = this.animal?.data_nascimento ? formatDate(
        new Date(this.animal.data_nascimento).toISOString(),'short','pt-BR','GMT-0') : '';
      this.form.patchValue({
        ...this.animal,
        data_nascimento: data_formatada,
        rebanho: numberToBoolean(this.animal?.rebanho),
        registrado: numberToBoolean(this.animal?.registrado),
        producao: numberToBoolean(this.animal?.producao),
      });
      this.editMode = false;
      this.form.disable();
    }
  }

  submit(): void {
    if(!this.form.valid) {
      return;
    }
    this.animal = this.form.getRawValue();
    this.animal.rebanho = booleanToNumber(!!this.form.controls['rebanho'].value);
    this.animal.registrado = this.form.controls['matriz'].value ? 1 : 0;
    this.animal.producao = booleanToNumber(!!this.form.controls['producao'].value);
    
    if(this.state.element?.id) {
      this.animal.id = this.state.element.id;
      this._animaisService.updateAnimal(this.state.element.id, this.animal).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.editMode = false;
        this.form.disable();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._animaisService.saveAnimal(this.animal).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.animal = res.data.rows[0];
        this.editMode = false;
        this.form.disable();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
  }

}
