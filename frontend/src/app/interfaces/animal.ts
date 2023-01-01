export interface Animal {
    id: number;
    nro_controle: number;
    matriz: number | null;
    nome_animal: string;
    sexo: number
    id_mae: number;
    id_reprodutor: number;
    data_nascimento: Date;
    rebanho: number;
    registrado: number;
    producao: number;
}