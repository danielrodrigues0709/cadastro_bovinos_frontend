export interface Animal {
    id: number;
    numControle: number;
    matriz: number;
    nomeAnimal: string;
    sexo: string
    mae: Animal;
    pai: Animal;
    dataNascimento: Date;
    rebanho: boolean;
    registrado: boolean;
    producao: boolean;
}