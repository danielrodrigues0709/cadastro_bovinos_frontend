import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { messages } from 'src/app/utils/enums';
import { findSpecialCharacters, snakeCase, validateFormFields } from 'src/app/utils/utils';

@Component({
  selector: 'app-edicao-usuario',
  templateUrl: './edicao-usuario.component.html',
  styleUrls: ['./edicao-usuario.component.scss'],
  providers: [MessageService]
})
export class EdicaoUsuarioComponent implements OnInit, OnDestroy {

  usuario!: Usuario;
  editModeUser!: boolean;
  editModePassword!: boolean;
  formUser!: FormGroup;
  formPassword!: FormGroup;
  loadingUser: boolean = false;
  loadingPassword: boolean = false;
  ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private _supabase: SupabaseService,
    private _authService: AuthService
  ) {
    this.usuario = this.config.data;

    // Se já tem usuário logado, começa em modo leitura
    this.editModeUser = this.usuario?.id ? false : true;

    this.createForm();
  }

  ngOnInit(): void {
    this.setFormValues(this.usuario);

    if (this.usuario?.id) {
      this.formUser.disable();
      this.formPassword.disable();
    } else {
      this.formUser.enable();
      this.formPassword.enable();
    }
  }

  createForm(): void {
    // Formulário de dados pessoais
    // Removido campo 'senha' — autenticação agora é 100% Supabase Auth
    this.formUser = this._fb.group({
      nome_usuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
    });

    // Formulário de troca de senha
    this.formPassword = this._fb.group({
      senha_atual: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      conf_senha: ['', Validators.required],
    });
  }

  setFormValues(element: any): void {
    this.formUser.patchValue({
      nome_usuario: element?.nome_usuario,
      email: element?.email,
      telefone: element?.telefone,
    });
  }

  editUser(): void {
    this.editModeUser = true;
    this.formUser.enable();
    // E-mail só pode ser editado se o usuário confirmar via Supabase
    // por segurança, deixamos desabilitado por padrão
    this.formUser.controls['email'].disable();
  }

  editPassword(): void {
    this.editModePassword = true;
    this.formPassword.enable();
  }

  cancel(user: boolean): void {
    if (user) {
      this.setFormValues(this.usuario);
      this.editModeUser = false;
      this.formUser.disable();
    } else {
      this.formPassword.reset();
      this.editModePassword = false;
      this.formPassword.disable();
    }
  }

  goBack(): void {
    this.ref.close(false);
  }

  // ─────────────────────────────────────────────
  // SUBMIT: atualizar dados do perfil
  // ─────────────────────────────────────────────
  async submitFormUser(): Promise<void> {
    if (!this.formUser.valid) {
      this._messageService.add({ severity: 'warn', detail: messages.REQUIRED });
      validateFormFields(this.formUser);
      return;
    }

    this.loadingUser = true;
    const formValue = this.formUser.getRawValue();

    // Atualiza na tabela profiles (full_name, phone)
    const { error } = await this._supabase.client
      .from('profiles')
      .update({
        full_name: formValue.nome_usuario,
        phone: formValue.telefone,
      })
      .eq('id', this.usuario.id);

    this.loadingUser = false;

    if (error) {
      console.log(error);
      
      this._messageService.add({ severity: 'error', detail: error.message });
      return;
    }

    // Atualiza o BehaviorSubject do AuthService
    const usuarioAtualizado: Usuario = {
      ...this.usuario,
      nome_usuario: formValue.nome_usuario,
    };
    this._authService.user.next(usuarioAtualizado);

    this._messageService.add({ severity: 'success', detail: 'Dados atualizados com sucesso!' });
    this.editModeUser = false;
    this.formUser.disable();
    this.ref.close(true);
  }

  // ─────────────────────────────────────────────
  // SUBMIT: troca de senha
  // Supabase não expõe verificação de senha atual
  // via client, então reautenticamos o usuário
  // antes de trocar
  // ─────────────────────────────────────────────
  async submitFormPassword(): Promise<void> {
    const { senha, conf_senha, senha_atual } = this.formPassword.getRawValue();

    if (senha !== conf_senha) {
      this._messageService.add({ severity: 'warn', detail: messages.PASSWORD });
      return;
    }

    if (!this.formPassword.valid) {
      this._messageService.add({ severity: 'warn', detail: messages.REQUIRED });
      validateFormFields(this.formPassword);
      return;
    }

    this.loadingPassword = true;

    // Passo 1: reautentica com a senha atual para validá-la
    const { error: authError } = await this._supabase.client.auth.signInWithPassword({
      email: this.usuario.email,
      password: senha_atual,
    });

    if (authError) {
      this.loadingPassword = false;
      this._messageService.add({ severity: 'error', detail: 'Senha atual incorreta!' });
      return;
    }

    // Passo 2: atualiza para a nova senha
    const { error: updateError } = await this._supabase.client.auth.updateUser({
      password: senha,
    });

    this.loadingPassword = false;

    if (updateError) {
      this._messageService.add({ severity: 'error', detail: updateError.message });
      return;
    }

    this._messageService.add({ severity: 'success', detail: 'Senha alterada com sucesso!' });
    this.formPassword.reset();
    this.editModePassword = false;
    this.formPassword.disable();
    this.ref.close(true);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.unsubscribe();
  }
}