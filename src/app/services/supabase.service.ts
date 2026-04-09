// src/app/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

// Infere o tipo diretamente do retorno do createClient
// sem precisar importar SupabaseClient como tipo
export type SupabaseClientType = ReturnType<typeof createClient>;

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  client: SupabaseClientType;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }
}