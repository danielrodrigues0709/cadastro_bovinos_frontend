import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { messages } from 'src/app/utils/enums';
import { validateFormFields } from 'src/app/utils/utils';
import { CadastroUsuarioComponent } from '../cadastro-usuario/cadastro-usuario.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DialogService, MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {
  
  form!: FormGroup;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private _fb: FormBuilder,
    private _usuariosService: UsuariosService,
    private _authService: AuthService,
    public dialogService: DialogService,
    private _messageService: MessageService,
  ) {
    this.createform();
  }

  ngOnInit(): void {
  }

  createform(): void {
    this.form = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  cadastrar(): void {
    const ref = this.dialogService.open(CadastroUsuarioComponent, {
      header: `Cadastrar Novo Usuário`,
      width: '80%'
    })
  }

  submit(): void {
    // if(!this.form.valid) {
    //   this._messageService.add({severity:'warn', detail: messages.REQUIRED});
    //   validateFormFields(this.form);
    //   return;
    // }
    let formValues = this.form.getRawValue();
    this._authService.logIn();
    window.location.reload();
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
