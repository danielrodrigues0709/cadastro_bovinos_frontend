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
  selector: 'app-edicao-usuario',
  templateUrl: './edicao-usuario.component.html',
  styleUrls: ['./edicao-usuario.component.scss']
})
export class EdicaoUsuarioComponent implements OnInit {

  usuario!: Usuario;
  editModeUser!: boolean;
  editModePassword!: boolean;
  formUser!: UntypedFormGroup;
  formPassword!: UntypedFormGroup;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: UntypedFormBuilder,
    private _messageService: MessageService,
    private _usuariosService: UsuariosService,
    private _authService: AuthService
  ) {
    this.usuario = this.config.data;
    this.editModeUser = this.usuario.id ? false : true;

    this.createform();
  }

  ngOnInit(): void {
    this.setFormValues(this.usuario);
    if(this.usuario.id) {
      this.formUser.disable();
      this.formPassword.disable();
    }
    else {
      this.formUser.enable();
      this.formPassword.enable();
    }
  }

  createform(): void {
    this.formUser = this._fb.group({
      nome_usuario: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      senha: ['', Validators.required],
    })

    this.formPassword = this._fb.group({
      senha_atual: ['', Validators.required],
      senha: ['', Validators.required],
      conf_senha: ['', Validators.required]
    })
  }

  setFormValues(element: any): void {
    this.formUser.patchValue({
      nome_usuario: element?.nome_usuario,
      username: element?.username,
      email: element?.email,
      telefone: element?.telefone
    })
  }

  setUsername(event: any): void {
    if(!this.usuario.id) {
      let value = event.target.value;
      this.formUser.get('username')?.patchValue(snakeCase(value));
    }
  }

  editUser(): void {
    this.editModeUser = true;
    this.formUser.enable();
    this.formUser.controls['username'].disable();
    this.formUser.controls['email'].disable();
  }

  editPassword(): void {
    this.editModePassword = true;
    this.formPassword.enable();
  }

  cancel(user: boolean): void {
    if(user) {
      this.setFormValues(this.usuario);
      this.editModeUser = false;
      this.formUser.disable();
    }
    else {
      this.editModePassword = false;
      this.formPassword.disable();
    }
  }

  goBack(): void {
    this.ref.close(false);
  }

  submitFormUser(): void {
    if(findSpecialCharacters(this.formUser.controls['username'].value)) {
      this._messageService.add({severity:'warn', detail: messages.USERNAME});
      return;
    }
    else if(!this.formUser.controls['email'].disabled && !this.formUser.controls['email'].valid) {
      this._messageService.add({severity:'warn', detail: messages.EMAIL});
      validateFormFields(this.formUser);
      return;
    }
    else if(!this.formUser.valid) {
      this._messageService.add({severity:'warn', detail: messages.REQUIRED});
      validateFormFields(this.formUser);
      return;
    }
    let formValue = this.formUser.getRawValue();

    this._usuariosService.getUsuario(formValue.username, formValue.senha).pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this._usuariosService.updateUsuario(this.usuario.id, formValue).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        this._authService.updateUserData(res.data.rows[0]);
        this._messageService.add({severity:'success', detail: res.message});
        this.ref.close(true);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    },
    err => {
      this._messageService.add({severity:'error', detail: 'Senha inválida!'});
    });
  }

  submitFormPassword(): void {
    if(this.formPassword.controls['senha'].value != this.formPassword.controls['conf_senha'].value) {
      this._messageService.add({severity:'warn', detail: messages.PASSWORD});
      return;
    }
    else if(!this.formPassword.valid) {
      this._messageService.add({severity:'warn', detail: messages.REQUIRED});
      validateFormFields(this.formPassword);
      return;
    }
    let formValue = this.formPassword.getRawValue();
    let user = {
      ...this.usuario,
      senha: formValue.senha
    }
    
    this._usuariosService.getUsuario(this.usuario.username, formValue.senha_atual).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res1 => {
      this._usuariosService.updateUsuario(this.usuario.id, user).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res2 => {
        this._messageService.add({severity:'success', detail: res2.message});
        this.ref.close(true);
      },
      err => {
        this._messageService.add({severity:'error', detail: err.error.message});
      })
    },
    err => {
      this._messageService.add({severity:'error', detail: 'Senha inválida!'});
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
