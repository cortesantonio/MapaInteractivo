import { Usuarios } from "./Usuarios";
import { Marcador } from "./Marcador";

export interface Registro_Logs {
    id: number;
    id_usuarios?: Usuarios;        // FK
    id_marcador?: Marcador;      // FK
    tipo_accion: string;
    detalle: string;
    fecha_hora: Date;
}
