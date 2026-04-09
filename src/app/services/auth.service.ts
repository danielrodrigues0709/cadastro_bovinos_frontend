// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { Usuario } from '../interfaces/usuario';

// Sem importar tipos do @supabase/supabase-js

@Injectable({ providedIn: 'root' })
export class AuthService {

  loggedIn = new BehaviorSubject<boolean>(false);
  user = new BehaviorSubject<Usuario>(null!);

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.restoreSession();

    // event e session tipados como 'any' temporariamente
    this.supabase.client.auth.onAuthStateChange(
      (event: any, session: any) => {
        if (session?.user) {
          this.loadProfile(session.user.id);
        } else {
          this.loggedIn.next(false);
          this.user.next(null!);
        }
      }
    );
  }

  private async restoreSession(): Promise<void> {
    const { data } = await this.supabase.client.auth.getSession();
    if (data.session?.user) {
      await this.loadProfile(data.session.user.id);
    }
  }

  private async loadProfile(userId: string): Promise<void> {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      this.loggedIn.next(false);
      this.user.next(null!);
      return;
    }

    const usuario: Usuario = {
      id: data.id,
      nome_usuario: data.full_name,
      email: data.email,
      role: data.role,
    };

    this.user.next(usuario);
    this.loggedIn.next(true);
  }

  updateUserData(usuario: Usuario): void {
    this.user.next(usuario);
  }

  async logOut(): Promise<void> {
    await this.supabase.client.auth.signOut();
    this.loggedIn.next(false);
    this.user.next(null!);
    this.router.navigate(['login']);
  }
}