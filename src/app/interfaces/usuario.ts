// src/app/interfaces/usuario.ts
export interface Usuario {
  id: string;           // era int, agora UUID do Supabase
  nome_usuario: string; // mapeia para full_name do profiles
  email: string;
  role?: string;        // owner | manager | employee | accountant | viewer
}