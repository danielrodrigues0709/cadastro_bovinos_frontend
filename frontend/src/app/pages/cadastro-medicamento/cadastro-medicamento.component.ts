import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Medicamento } from 'src/app/interfaces/Medicamento';
import { MedicamentosService } from 'src/app/services/medicamentos.service';

@Component({
  selector: 'app-cadastro-medicamento',
  templateUrl: './cadastro-medicamento.component.html',
  styleUrls: ['./cadastro-medicamento.component.scss']
})
export class CadastroMedicamentoComponent implements OnInit {

  medicamento!: Medicamento;
  editMode!: boolean;
  form!: FormGroup;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
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
    })
  }

  setFormValues(element: any): void {
    this.form.patchValue({
      medicamento: element?.medicamento
    })
  }

  edit(): void {
    this.editMode = true;
    this.form.enable();
  }

  cancel(goBack: boolean): void {
    if(goBack) {
      this.ref.close();
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
      return;
    }
    let formValue = this.form.value;
    
    if(this.medicamento.id) {
      this._medicamentoService.updateMedicamento(this.medicamento.id, formValue).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._medicamentoService.saveMedicamento(formValue).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
  }

}
