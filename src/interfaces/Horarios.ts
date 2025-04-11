import { Marcador } from "./Marcador";

export interface Horarios {
  id: number;
  id_marcador: Marcador;          // FK
  dia: string;
  apertura: string;
  cierre: string;
}

