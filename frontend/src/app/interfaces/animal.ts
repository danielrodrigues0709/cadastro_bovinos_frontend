export interface Animal {
    id: number;
    nuro_controle: number;
    matriz: number | null;
    nome_animal: string;
    sexo: number
    id_mae: Animal | null;
    id_pai: Animal | null;
    data_nascimento: Date;
    rebanho: number;
    registrado: number;
    producao: number;
}