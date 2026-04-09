import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';
import { messages } from 'src/app/utils/enums';
import { validateFormFields } from 'src/app/utils/utils';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.scss'],
  providers: [MessageService]
})
export class CadastroUsuarioComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  loading: boolean = false;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private _supabase: SupabaseService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm(): void {
    this.form = this._fb.group({
      nome_usuario: ['', Validators.required],
      email:        ['', [Validators.required, Validators.email]],
      telefone:     [''],
      senha:        ['', [Validators.required, Validators.minLength(6)]],
      conf_senha:   ['', Validators.required],
    });
  }

  cancel(): void {
    this.ref.close(false);
  }

  async submit(): Promise<void> {
    const senha     = this.form.controls['senha'].value;
    const conf_senha = this.form.controls['conf_senha'].value;

    // Validações — mesma ordem do original
    if (senha !== conf_senha) {
      this._messageService.add({ severity: 'warn', detail: messages.PASSWORD });
      return;
    }

    if (!this.form.valid) {
      this._messageService.add({ severity: 'warn', detail: messages.REQUIRED });
      validateFormFields(this.form);
      return;
    }

    this.loading = true;
    const { nome_usuario, email, telefone, senha: password } = this.form.getRawValue();

    // Passo 1: cria o usuário no Supabase Auth
    const { data, error: signUpError } = await this._supabase.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nome_usuario,  // vai para auth.users e pode popular profiles via trigger
          phone: telefone,
        }
      }
    });

    if (signUpError) {
      this.loading = false;
      this._messageService.add({
        severity: 'error',
        detail: this.translateError(signUpError.message)
      });
      return;
    }

    // Passo 2: salva dados complementares na tabela profiles
    // (caso não use trigger automático no Supabase)
    if (data.user) {
      const { error: profileError } = await this._supabase.client
        .from('profiles')
        .upsert({
          id:        data.user.id,
          full_name: nome_usuario,
          email:     email,
          phone:     telefone,
          role:      'viewer', // role padrão para novos usuários
        });

      if (profileError) {
        this.loading = false;
        this._messageService.add({ severity: 'error', detail: profileError.message });
        return;
      }
    }

    this.loading = false;
    this._messageService.add({ severity: 'success', detail: 'Usuário criado com sucesso!' });
    this.ref.close(true);
  }

  // Traduz erros do Supabase para pt-BR
  private translateError(message: string): string {
    const errors: Record<string, string> = {
      'User already registered':          'E-mail já cadastrado.',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
      'Unable to validate email address: invalid format': 'E-mail inválido.',
    };
    return errors[message] ?? 'Erro ao cadastrar usuário. Tente novamente.';
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.unsubscribe();
  }
}