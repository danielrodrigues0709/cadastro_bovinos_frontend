import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VacinaVermifugo } from 'src/app/interfaces/vacina-vermifugo';
import { VacinasService } from 'src/app/services/vacinas.service';

@Component({
  selector: 'app-cadastro-vacina',
  templateUrl: './cadastro-vacina.component.html',
  styleUrls: ['./cadastro-vacina.component.scss']
})
export class CadastroVacinaComponent implements OnInit {

  vacina_vermifugo!: VacinaVermifugo;
  editMode!: boolean;
  form!: FormGroup;
  tipo: any[] = [{label: 'Vacina', value: 0}, {label: 'Vermífugo', value: 1}];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
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
      doses: ['', Validators.required],
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
      this.ref.close();
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
      return;
    }
    let formValue = this.form.value;
    
    if(this.vacina_vermifugo.id) {
      this._vacinasService.updateVacina(this.vacina_vermifugo.id, formValue).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
    else {
      this._vacinasService.saveVacina(formValue).subscribe(res => {
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close();
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    }
  }

}
