import { Solicitud } from "./Solicitud";
import { Accesibilidad } from "./Accesibilidad";

export interface Accesibilidad_Solicitud {
    id: number;
    id_solicitud: Solicitud;        // FK
    id_accesibilidad: Accesibilidad; // FK
  }
  