import { Usuarios } from "./Usuario";
import { Marcador } from "./Marcador";

export interface RegistroAdministrativo {
    id: number;
    idUsuarios?: Usuarios;        // FK
    idMarcador?: Marcador;      // FK
    tipoAccion: string;
    detalle: string;
    fechaHora: Date;
}
