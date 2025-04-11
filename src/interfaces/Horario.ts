import { Marcador } from "./Marcador";

export interface Horario {
  id: number;
  id_marcador: Marcador;          // FK
  dia: string;
  hora_apertura: string;
  hora_cierre: string;
}

