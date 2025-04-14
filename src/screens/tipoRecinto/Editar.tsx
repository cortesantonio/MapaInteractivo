import styles from './css/Agregar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';

interface EditarTipoRecintoProps {
    idTipoRecinto: number; 
    onCancel: () => void;
    onUpdate: () => void;
}

export default function EditarTipoRecinto({ idTipoRecinto, onCancel, onUpdate }: EditarTipoRecintoProps) {
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

        if ( formData.tipo === '') {
            alert('Todos los campos son obligatorios');
            return;
        }

        const { data, error } = await supabase
            .from('tipo_recinto')
            .update({
                tipo: formData.tipo,
            })
            .eq('id', formData.id);

        if (error) {
            console.error('Error al actualizar:', error);
            alert('Ocurrió un error al actualizar el registro.');
        } else {
            alert('Registro actualizado correctamente');
            onUpdate(); 
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.titulo}>
                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onClick={onCancel}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
                <h2 style={{ textAlign: 'center' }}>
                    Editar Accesibilidad
                </h2>
            </div>

            <div style={{ margin: '20px auto', width: '40%', display: 'flex', justifyContent: 'center', flexDirection: 'column', minWidth: '250px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}>
                    <label className={styles.labelSeccion} >TIPO</label>
                    <input name="tipo"  onChange={handleChange} value={formData.tipo}
                        className={styles.inputText} />
                </div>

                <div className={styles.acciones}>
                    <button style={{ color: 'red', background: 'transparent' }} onClick={onCancel}>Cancelar</button>
                    <button onClick={handleSubmit}>Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
}
