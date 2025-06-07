import styles from './css/Agregar.module.css'
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import NavbarAdmin from '../../components/NavbarAdmin';

import { useAuth } from '../../hooks/useAuth';

interface EditarTipoRecintoProps {
    idTipoRecinto: number;
    onCancel: () => void;
    onUpdate: () => void;
}

export default function EditarTipoRecinto({ idTipoRecinto, onCancel, onUpdate }: EditarTipoRecintoProps) {

    const { user } = useAuth()
    const [formData, setFormData] = useState<Tipo_Recinto>({
        id: idTipoRecinto,
        tipo: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('tipo_recinto')
                .select('*')
                .eq('id', idTipoRecinto)
                .single();

            if (error) {
                console.error('Error al cargar datos:', error);
            } else if (data) {
                setFormData(data);
            }
        };

        fetchData();
    }, [idTipoRecinto]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'id' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.tipo === '') {
            alert('Todos los campos son obligatorios');
            return;
        }

        const { error } = await supabase
            .from('tipo_recinto')
            .update({
                tipo: formData.tipo,
            })
            .eq('id', formData.id);

        if (error) {
            console.error('Error al actualizar:', error);
            alert('Ocurrió un error al actualizar el registro.');
        } else {
            alert('Tipo Recinto actualizado correctamente');
            onUpdate();
            Registro_cambios(formData.id);
        }

    };

    const fechaHoraActual = new Date().toISOString();

    const Registro_cambios = async (id: number) => {
        const { error: errorLog } = await supabase
            .from('registro_logs')
            .insert([
                {
                    id_usuario: user?.id,
                    tipo_accion: 'Edición de Tipo Recinto',
                    detalle: `Se editó un Tipo de Recinto con ID ${id}`,
                    fecha_hora: fechaHoraActual,
                }
            ]);

        if (errorLog) {
            console.error('Error al registrar en los logs:', errorLog);
            return;
        }

    };

    return (
        <>
            <NavbarAdmin />
            <div className={styles.container}>
                <div className={styles.titulo}>

                    <h2 style={{ textAlign: 'center' }}>
                        Editar tipo de recinto
                    </h2>
                </div>

                <div style={{ margin: '20px auto', width: '40%', display: 'flex', justifyContent: 'center', flexDirection: 'column', minWidth: '250px' }}>
                    <div className={styles.formularioCentro}>
                        <label className={styles.labelSeccion} >Tipo</label>
                        <input name="tipo" onChange={handleChange} value={formData.tipo}
                            className={styles.inputText} />
                    </div>

                    <div className={styles.acciones}>
                        <button style={{ color: 'red', background: 'transparent' }} onClick={onCancel}>Cancelar</button>
                        <button onClick={handleSubmit}>Guardar cambios</button>
                    </div>
                </div>
            </div>
        </>
    );
}
