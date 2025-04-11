import { Usuarios } from "./Usuarios";


export interface Registro_Logs {
    id: number;
    id_usuario?: Usuarios;      // FK
    tipo_accion: string;
    detalle: string;
    fecha_hora: Date;
}
