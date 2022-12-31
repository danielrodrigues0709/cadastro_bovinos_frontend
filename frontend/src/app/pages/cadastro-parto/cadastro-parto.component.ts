import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Animal } from 'src/app/interfaces/animal';
import { Parto } from 'src/app/interfaces/parto';
import { AnimaisService } from 'src/app/services/animais.service';
import { PartosService } from 'src/app/services/partos.service';
import { sexo } from 'src/app/utils/enums';

@Component({
  selector: 'app-cadastro-parto',
  templateUrl: './cadastro-parto.component.html',
  styleUrls: ['./cadastro-parto.component.scss']
})
export class CadastroPartoComponent implements OnInit {

  parto!: Parto;
  // mae!: Animal;
  // reprodutor!: Animal;
  editMode!: boolean;
  form!: FormGroup;
  maesOptions: any[] = [];
  reprodutoresOptions: any[] = [];
  sexo: any[] = [{label: 'Fêmea', value: 0}, {label: 'Macho', value: 1}];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private _partoService: PartosService,
    private _animalService: AnimaisService,
    private _messageService: MessageService
  ) {
    this.parto = this.config.data;
    this.editMode = this.parto.id ? false : true;

    this.createform();
  }

  ngOnInit(): void {
    this.setFormValues(this.parto);
    this.parto.id ? this.form.disable() : this.form.enable();
    this.autocompleteMae();
    this.autocompleteReprodutor();
  }

  autocompleteMae(event?: any): void {
    let params: any = {};
    params.nomeAnimal = event ? event?.query : "";
    params.sexo = sexo.FEMEA;
    this._animalService.getAnimais(params).subscribe(res => {
      this.maesOptions = res.rows;
    })
  }

  autocompleteReprodutor(event?: any): void {
    let params: any = {};
    params.nomeAnimal = event ? event?.query : "";
    params.sexo = sexo.MACHO;
    this._animalService.getAnimais(params).subscribe(res => {
      this.reprodutoresOptions = res.rows;
    })
  }

  // onSelectMother(event: any): void {
  //   this.mae = event;
  // }

  // onSelectFather(event: any): void {
  //   this.reprodutor = event;
  // }

  createform(): void {
    this.form = this._fb.group({
      data_parto: ['', Validators.required],
      vivo: [true, Validators.required],
      nro_controle_cria: ['', Validators.required],
      nome_cria: ['', Validators.required],
      reprodutor: ['', Validators.required],
      mae: ['', Validators.required],
      sexo: ['', Validators.required]
    })
  }

  setFormValues(element: any): void {
    this.form.patchValue({
      data_parto: element.id ? new Date(element.data_parto): '',
      nro_controle_cria: element?.nro_controle_cria,
      nome_cria: element?.nome_cria,
      reprodutor: element?.reprodutor,
      mae: element?.mae,
      sexo: element?.sexo
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
        ...this.parto
      });
      this.editMode = false;
      this.form.disable();
    }
  }

  saveAnimal(): void {
    
  }

  submit(): void {
    if(!this.form.valid) {
      return;
    }
    let formValue = this.form.value;
    let params = { 
      ...formValue,
    }

    console.log(params)
    
    // if(this.parto.id) {
    //   this._partoService.updateParto(this.parto.id, params).subscribe(res => {
    //     this._messageService.add({severity:'success', detail: res.message});
    //     this.saveAnimal();
    //   },
    //   err => {
    //     this._messageService.add({severity:'error', detail: err.error.message});
    //   })
    // }
    // else {
    //   this._partoService.saveParto(params).subscribe(res => {
    //     this._messageService.add({severity:'success', detail: res.message});
    //     this.saveAnimal();
    //   },
    //   err => {
    //     this._messageService.add({severity:'error', detail: err.error.message});
    //   })
    // }
  }

}
