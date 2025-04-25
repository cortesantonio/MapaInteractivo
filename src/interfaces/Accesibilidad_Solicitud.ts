import { Solicitudes } from "./Solicitudes";
import { Accesibilidad } from "./Accesibilidad";

export interface Accesibilidad_Solicitud {
    id: number;
    id_solicitud: Solicitudes;        // FK
    id_accesibilidad: Accesibilidad; // FK
  }
  