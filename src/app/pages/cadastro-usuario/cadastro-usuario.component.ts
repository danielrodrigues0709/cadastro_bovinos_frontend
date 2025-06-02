import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { messages } from 'src/app/utils/enums';
import { findSpecialCharacters, snakeCase, validateFormFields } from 'src/app/utils/utils';

@Component({
    selector: 'app-cadastro-usuario',
    templateUrl: './cadastro-usuario.component.html',
    styleUrls: ['./cadastro-usuario.component.scss'],
    standalone: false
})
export class CadastroUsuarioComponent implements OnInit, OnDestroy {

  editMode!: boolean;
  form!: UntypedFormGroup;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: UntypedFormBuilder,
    private _messageService: MessageService,
    private _usuariosService: UsuariosService,
    private _authService: AuthService
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
    
    this._usuariosService.saveUsuario(formValue).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this._usuariosService.getUsuario(formValue.username, formValue.senha).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        // this._authService.logIn(res); // Retirado pois monta página de login dentro da home
        this._messageService.add({severity:'success', detail: "Usuário criado com sucesso!"});
        // TODO Alterar msg para res.message
        this.ref.close(true);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    },
    err => {
      this._messageService.add({severity:'error', detail: err.error.message});
    })
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
