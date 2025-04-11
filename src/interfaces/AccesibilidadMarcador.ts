import { Marcador } from "./Marcador";
import { Accesibilidad } from "./Accesibilidad";

export interface AccesibilidadMarcador {
    id: number;
    idMarcador: Marcador;          // FK
    idAccesibilidad: Accesibilidad; // FK
}
