import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { messages } from 'src/app/utils/enums';
import { validateFormFields } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import { CadastroUsuarioComponent } from '../cadastro-usuario/cadastro-usuario.component';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DialogService, MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {
  
  form!: FormGroup;
  ngUnsubscribe: Subject<any> = new Subject<any>();
  recover_password: string = environment.api;

  constructor(
    private _fb: FormBuilder,
    private _supabaseService: SupabaseService,
    private _authService: AuthService,
    public dialogService: DialogService,
    private _messageService: MessageService,
    public router: Router,
  ) {
    this.createform();
  }

  ngOnInit(): void {
  }

  createform(): void {
    this.form = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  cadastrar(): void {
    const ref = this.dialogService.open(CadastroUsuarioComponent, {
      data: {},
      header: `Cadastrar Novo Usuário`,
      width: '80%'
    })
  }

  submit(): void {
    if(!this.form.valid) {
      this._messageService.add({severity:'warn', detail: messages.REQUIRED});
      validateFormFields(this.form);
      return;
    }
    let formValues = this.form.getRawValue();
    this._supabaseService.signIn(formValues.email, formValues.password).then(({ data, error }) => {
      if (error) {
        this._messageService.add({severity:'error', detail: "Credenciais inválidas"});
        return;
      }
      this._authService.logIn(data);
      this.router.navigate(['home']);
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
