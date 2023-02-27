import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Animal } from 'src/app/interfaces/animal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { booleanToNumber, dateToStr, numberToBoolean, strToDate, validateFormFields } from 'src/app/utils/utils';
import { AnimaisService } from 'src/app/services/animais.service';
import { MessageService } from 'primeng/api';
import { messages, sexo } from 'src/app/utils/enums';
import { DialogService } from 'primeng/dynamicdialog';
import { CadastroInseminacaoComponent } from '../cadastro-inseminacao/cadastro-inseminacao.component';
import { CadastroPartoComponent } from '../cadastro-parto/cadastro-parto.component';
import { CadastroVacinacaoComponent } from '../cadastro-vacinacao/cadastro-vacinacao.component';
import { CadastroOcorrenciaComponent } from '../cadastro-ocorrencia/cadastro-ocorrencia.component';
import { InseminacoesService } from 'src/app/services/inseminacoes.service';
import { PartosService } from 'src/app/services/partos.service';
import { VacinacoesService } from 'src/app/services/vacinacoes.service';
import { OcorrenciasService } from 'src/app/services/ocorrencias.service';
import { Subject, takeUntil } from 'rxjs';
import { FamilyTreeComponent } from '../family-tree/family-tree.component';

@Component({
  selector: 'app-cadastro-animal',
  templateUrl: './cadastro-animal.component.html',
  styleUrls: ['./cadastro-animal.component.scss'],
  providers: [DialogService, MessageService]
})
export class CadastroAnimalComponent implements OnInit, OnDestroy {

  state: any;
  title: string = '';
  animal: Animal;
  editMode: boolean;
  form!: FormGroup;
  maesOptions: any[] = [];
  reprodutoresOptions: any[] = [];
  sexo: any[] = [{label: 'Fêmea', value: 0}, {label: 'Macho', value: 1}];
  changed: boolean = false;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private _location: Location,
    private _fb: FormBuilder,
    private _animaisService: AnimaisService,
    private _messageService: MessageService,
    public dialogService: DialogService,
    private _inseminacoesService: InseminacoesService,
    private _partosService: PartosService,
    private _vacinacoesService: VacinacoesService,
    private _ocorrenciasService: OcorrenciasService,
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
    this.autocompleteMae();
    this.autocompleteReprodutor();
  }

  autocompleteMae(event?: any): void {
    let params: any = {};
    params.nomeAnimal = event ? event?.query : "";
    params.sexo = sexo.FEMEA;
    this._animaisService.getAnimais(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      let notItself = res.rows.filter((res: any) => this.animal?.id != res.id);
      this.maesOptions = notItself;
    })
  }

  autocompleteReprodutor(event?: any): void {
    let params: any = {};
    params.nomeAnimal = event ? event?.query : "";
    params.sexo = sexo.MACHO;
    this._animaisService.getAnimais(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      let notItself = res.rows.filter((res: any) => this.animal?.id != res.id);
      this.reprodutoresOptions = notItself;
    })
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
      mae: ['', Validators.required],
      reprodutor: ['', Validators.required],
    })
  }

  setFormValues(element: any): void {
    this.form.patchValue({
      nro_controle: element?.nro_controle,
      matriz: element?.matriz,
      nome_animal: element?.nome_animal,
      sexo: element?.sexo,
      data_nascimento: element?.id ? dateToStr(element.data_nascimento) : '',
      rebanho: element ? numberToBoolean(element?.rebanho) : true,
      producao: element ? numberToBoolean(element.producao) : true,
      mae: element?.mae,
      reprodutor: element?.reprodutor
    })
  }

  familyTree(): void {
    let formValue = this.form.getRawValue();
    let family = {
      mae: formValue.mae,
      reprodutor: formValue.reprodutor,
    };
    const ref = this.dialogService.open(FamilyTreeComponent, {
      data: {
        animal: this.animal,
        family: family
      },
      header: `Árvore Genealógica`
    });
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
      this.form.patchValue({
        ...this.animal,
        data_nascimento: dateToStr(this.animal.data_nascimento),
        rebanho: numberToBoolean(this.animal?.rebanho),
        registrado: numberToBoolean(this.animal?.registrado),
        producao: numberToBoolean(this.animal?.producao),
      });
      this.editMode = false;
      this.form.disable();
    }
  }

  includeInseminacao(): void {
    const ref = this.dialogService.open(CadastroInseminacaoComponent, {
      data: {
        animal: this.animal
      },
      header: `Nova Inseminacao`,
      width: '80%'
    })
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._inseminacoesService.triggerInseminacoesUpdate();
    });
  }

  includeParto(): void {
    const ref = this.dialogService.open(CadastroPartoComponent, {
      data: {
        mae: this.animal
      },
      header: `Novo Parto`,
      width: '80%'
    })
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._partosService.triggerPartosUpdate();
    });
  }

  includeVacinacao(): void {
    const ref = this.dialogService.open(CadastroVacinacaoComponent, {
      data: {
        animal: this.animal
      },
      header: `Nova Vacinação/Vermifugação`,
      width: '80%'
    })
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._vacinacoesService.triggerVacinacoesUpdate();
    });
  }

  includeOcorrencia(): void {
    const ref = this.dialogService.open(CadastroOcorrenciaComponent, {
      data: {
        animal: this.animal
      },
      header: `Nova Ocorrência`,
      width: '80%'
    })
    .onClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((edited: boolean) => {
      if(edited)
        this._ocorrenciasService.triggerOcorrenciasUpdate();
    });
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
      data_nascimento: this.changed ? formValues.data_nascimento : strToDate(formValues.data_nascimento),
      rebanho: booleanToNumber(!!formValues.rebanho),
      registrado: formValues.matriz ? 1 : 0,
      producao: booleanToNumber(!!formValues.producao),
      id_mae: formValues.mae.id,
      id_reprodutor: formValues.reprodutor.id
    }
    this.animal = params;
    
    if(this.state.element?.id) {
      this.animal.id = this.state.element.id;
      this._animaisService.updateAnimal(this.state.element.id, params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.editMode = false;
        this.form.disable();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._animaisService.saveAnimal(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
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
  
  onSubscriptionsDestroy(ngUnsubscribe: Subject<any>): void {
    ngUnsubscribe.next(true);
	  ngUnsubscribe.complete();
	  ngUnsubscribe.unsubscribe();
	}

	ngOnDestroy(): void {
	  this.onSubscriptionsDestroy(this.ngUnsubscribe);
	}

}
