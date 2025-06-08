import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { messages } from 'src/app/utils/enums';
import { findSpecialCharacters, snakeCase, validateFormFields } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.scss']
})
export class CadastroUsuarioComponent implements OnInit, OnDestroy {

  editMode!: boolean;
  form!: FormGroup;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private _authService: AuthService,
    private _supabaseService: SupabaseService,
  ) {
    this.createform();
  }

  ngOnInit(): void {
  }

  createform(): void {
    this.form = this._fb.group({
      nome_usuario: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      senha: ['', Validators.required],
      conf_senha: ['', Validators.required],
    })
  }

  setUsername(event: any): void {
    let value = event.target.value;
    this.form.get('username')?.patchValue(snakeCase(value));
  }

  edit(): void {
    this.editMode = true;
    this.form.enable();
    this.form.controls['username'].disable();
    this.form.controls['email'].disable();
  }

  cancel(): void {
    this.ref.close(false);
  }

  submit(): void {
    if(findSpecialCharacters(this.form.controls['username'].value)) {
      this._messageService.add({severity:'warn', detail: messages.USERNAME});
      return;
    }
    else if(!this.form.controls['email'].disabled && !this.form.controls['email'].valid) {
      this._messageService.add({severity:'warn', detail: messages.EMAIL});
      validateFormFields(this.form);
      return;
    }
    else if(this.form.controls['senha'].value != this.form.controls['conf_senha'].value) {
      this._messageService.add({severity:'warn', detail: messages.PASSWORD});
      return;
    }
    else if(!this.form.valid) {
      this._messageService.add({severity:'warn', detail: messages.REQUIRED});
      validateFormFields(this.form);
      return;
    }
    let formValue = this.form.getRawValue();

    console.log(formValue);
    
    
    this._supabaseService.signUp(formValue)
    .then(({ data, error }) => {
      if (error) {
        this._messageService.add({severity:'error', detail: "Erro ao criar usuário."});
        return;
      }
      console.log(data);
      this._messageService.add({severity:'success', detail: "Verifique seu email para confirmação de novo usuário."});
      this.ref.close(true);
    });
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
