// src/app/pages/login/login.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { messages } from 'src/app/utils/enums';
import { validateFormFields } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import { SupabaseService } from 'src/app/services/supabase.service';
import { CadastroUsuarioComponent } from '../cadastro-usuario/cadastro-usuario.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [DialogService, MessageService]
})
export class LoginComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  loading: boolean = false;

  // Aponta para o flow de recuperação de senha do próprio Supabase
  recover_password: string = environment.recover_password;

  constructor(
    private _fb: FormBuilder,
    private _supabase: SupabaseService,
    public dialogService: DialogService,
    private _messageService: MessageService,
    public router: Router,
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm(): void {
    this.form = this._fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  cadastrar(): void {
    // Permanece igual ao seu código original
    this.dialogService.open(CadastroUsuarioComponent, {
      data: {},
      header: 'Cadastrar Novo Usuário',
      width: '80%'
    });
  }

  async submit(): Promise<void> {
    if (!this.form.valid) {
      this._messageService.add({ severity: 'warn', detail: messages.REQUIRED });
      validateFormFields(this.form);
      return;
    }

    this.loading = true;
    const { username, password } = this.form.getRawValue();

    const { data, error } = await this._supabase.client.auth.signInWithPassword({
      email: username,
      password: password
    });

    this.loading = false;

    if (error) {
      this._messageService.add({
        severity: 'error',
        detail: this.translateError(error.message)
      });
      return;
    }

    // Login OK: navega para home
    this.router.navigate(['home']);
  }

  // Traduz as mensagens de erro do Supabase para pt-BR
  private translateError(message: string): string {
    const errors: Record<string, string> = {
      'Invalid login credentials': 'E-mail ou senha incorretos.',
      'Email not confirmed': 'E-mail ainda não confirmado. Verifique sua caixa de entrada.',
      'Too many requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
    };
    return errors[message] ?? 'Erro ao realizar login. Tente novamente.';
  }

  ngOnDestroy(): void {}
}