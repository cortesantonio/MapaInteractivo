import { Marcador } from "./Marcador";

export interface Horarios {
  id: number;
  idMarcador: Marcador;          // FK
  dia: string;
  horaApertura: string;
  horaCierre: string;
}

