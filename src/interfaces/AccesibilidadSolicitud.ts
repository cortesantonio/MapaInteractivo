import { Solicitud } from "./Solicitud";
import { Accesibilidad } from "./Accesibilidad";

export interface AccesibilidadSolicitud {
    id: number;
    idSolicitud: Solicitud;        // FK
    idAccesibilidad: Accesibilidad; // FK
  }
  