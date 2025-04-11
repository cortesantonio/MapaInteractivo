import { Marcador } from "./Marcador";
import { Accesibilidad } from "./Accesibilidad";

export interface Accesibilidad_Marcador {
    id: number;
    id_marcador: Marcador;          // FK
    id_accesibilidad: Accesibilidad; // FK
}
