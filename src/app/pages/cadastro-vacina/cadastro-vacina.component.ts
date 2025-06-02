import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { VacinaVermifugo } from 'src/app/interfaces/vacina-vermifugo';
import { VacinasService } from 'src/app/services/vacinas.service';
import { messages } from 'src/app/utils/enums';
import { validateFormFields } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-vacina',
  templateUrl: './cadastro-vacina.component.html',
  styleUrls: ['./cadastro-vacina.component.scss']
})
export class CadastroVacinaComponent implements OnInit, OnDestroy {

  vacina_vermifugo!: VacinaVermifugo;
  editMode!: boolean;
  form!: UntypedFormGroup;
  tipo: any[] = [{label: 'Vacina', value: 0}, {label: 'Vermífugo', value: 1}];
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: UntypedFormBuilder,
    private _vacinasService: VacinasService,
    private _messageService: MessageService
  ) {
    this.vacina_vermifugo = this.config.data;
    this.editMode = this.vacina_vermifugo.id ? false : true;

    this.createform();
  }

  ngOnInit(): void {
    this.setFormValues(this.vacina_vermifugo);
    this.vacina_vermifugo.id ? this.form.disable() : this.form.enable();
  }

  createform(): void {
    this.form = this._fb.group({
      vacina_vermifugo: ['', Validators.required],
      doses: [''],
      tipo: ['', Validators.required],
    })
  }

  setFormValues(element: any): void {
    this.form.patchValue({
      vacina_vermifugo: element?.vacina_vermifugo,
      doses: element?.doses,
      tipo: element?.tipo
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
        ...this.vacina_vermifugo
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
    let formValue = this.form.getRawValue();
    let params = {
      ...formValue,
      doses: formValue.doses ? formValue.doses : null
    }
    
    if(this.vacina_vermifugo.id) {
      this._vacinasService.updateVacina(this.vacina_vermifugo.id, params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close(true);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._vacinasService.saveVacina(params).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
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
