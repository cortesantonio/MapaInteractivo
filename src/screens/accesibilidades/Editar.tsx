import styles from './css/Agregar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';

interface EditarAccesibilidadProps {
    accesibilidadId: number;
    onCancel: () => void;
    onUpdate: () => void;
}

export default function EditarAccesibilidad({ accesibilidadId, onCancel, onUpdate }: EditarAccesibilidadProps) {
    const { id } = useParams();
    const { user } = useAuth();
    const [formData, setFormData] = useState<Accesibilidad>({
        id: accesibilidadId,
        tipo: '',
        nombre: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('accesibilidad')
                .select('*')
                .eq('id', accesibilidadId)
                .single();

            if (error) {
                console.error('Error al cargar datos:', error);
            } else if (data) {
                setFormData(data);
            }
        };

        fetchData();
    }, [accesibilidadId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'id' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.nombre === '' || formData.tipo === '') {
            alert('Todos los campos son obligatorios');
            return;
        }

        const { error } = await supabase
            .from('accesibilidad')
            .update({
                tipo: formData.tipo,
                nombre: formData.nombre,
            })
            .eq('id', formData.id);


        if (error) {
            console.error('Error al actualizar:', error);
            alert('Ocurrió un error al actualizar el registro.');
        } else {
            alert('Accesibilidad actualizada correctamente');
            onUpdate();
            Registro_cambios(formData.id);
        }

    };

    const fechaHoraActual = new Date().toISOString();

    const Registro_cambios = async (id: number) => {
        const { data: registro_logs, error: errorLog } = await supabase
            .from('registro_logs')
            .insert([
                {
                    id_usuario: user?.id,
                    tipo_accion: 'Edición de Accesibilidad',
                    detalle: `Se editó una Accesibilidad con ID ${id}`,
                    fecha_hora: fechaHoraActual,
                }
            ]);

        if (errorLog) {
            console.error('Error al registrar en los logs:', errorLog);
            return;
        }

        console.log(' Registro insertado en registro_logs correctamente', registro_logs);
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
                    <label className={styles.labelSeccion}>Tipo Accesibilidad</label>
                    <select name="tipo" value={formData.tipo} onChange={handleChange}>
                        <option value="">Selecciona un tipo</option>
                        <option value="Arquitectónica">Arquitectónica</option>
                        <option value="Sensorial">Sensorial</option>
                        <option value="Cognitiva">Cognitiva</option>
                        <option value="CA">CA</option>
                    </select>
                    <label className={styles.labelSeccion}>Nombre</label>
                    <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={styles.inputText}
                    />
                </div>

                <div className={styles.acciones}>
                    <button style={{ color: 'red', background: 'transparent' }} onClick={onCancel}>Cancelar</button>
                    <button onClick={handleSubmit}>Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
}
