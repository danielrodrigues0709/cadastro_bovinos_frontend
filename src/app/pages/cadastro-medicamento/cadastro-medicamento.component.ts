import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Medicamento } from 'src/app/interfaces/medicamento';
import { MedicamentosService } from 'src/app/services/medicamentos.service';
import { messages } from 'src/app/utils/enums';
import { validateFormFields } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-medicamento',
  templateUrl: './cadastro-medicamento.component.html',
  styleUrls: ['./cadastro-medicamento.component.scss']
})
export class CadastroMedicamentoComponent implements OnInit, OnDestroy {

  medicamento!: Medicamento;
  editMode!: boolean;
  form!: UntypedFormGroup;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: UntypedFormBuilder,
    private _medicamentoService: MedicamentosService,
    private _messageService: MessageService
  ) {
    this.medicamento = this.config.data;
    this.editMode = this.medicamento.id ? false : true;

    this.createform();
  }

  ngOnInit(): void {
    this.setFormValues(this.medicamento);
    this.medicamento.id ? this.form.disable() : this.form.enable();
  }

  createform(): void {
    this.form = this._fb.group({
      medicamento: ['', Validators.required],
      principio_ativo: [''],
    })
  }

  setFormValues(element: any): void {
    this.form.patchValue({
      medicamento: element?.medicamento,
      principio_ativo: element?.principio_ativo
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
        ...this.medicamento
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
    
    if(this.medicamento.id) {
      this._medicamentoService.updateMedicamento(this.medicamento.id, formValue).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close(true);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._medicamentoService.saveMedicamento(formValue).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
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
