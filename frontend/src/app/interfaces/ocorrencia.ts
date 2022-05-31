export interface Ocorrencia {
	data_ocorrencia: Date;
	descricao: string;
	id_animal: number;
	id_medicamento: number | null
}