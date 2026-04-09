// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const { data } = await this.supabase.client.auth.getSession();

    if (data.session) {
      return true;
    }

    // Salva a rota que o usuário tentou acessar
    // para redirecionar após o login
    this.router.navigate(['login'], {
      queryParams: { returnUrl: state.url }
    });

    return false;
  }
}