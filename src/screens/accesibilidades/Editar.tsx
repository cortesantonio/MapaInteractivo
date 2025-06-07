import styles from './css/Agregar.module.css'
import NavbarAdmin from '../../components/NavbarAdmin';
import { useState, useEffect } from 'react';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';


interface EditarAccesibilidadProps {
    accesibilidadId: number;
    onCancel: () => void;
    onUpdate: () => void;
}

export default function EditarAccesibilidad({ accesibilidadId, onCancel, onUpdate }: EditarAccesibilidadProps) {

    const { user } = useAuth();
    const [formData, setFormData] = useState<Accesibilidad>({
        id: accesibilidadId,
        tipo: '',
        nombre: '',
        imagen: ''
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
                imagen: formData.imagen
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
        const { error: errorLog } = await supabase
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

    };

    return (

        <>
            <NavbarAdmin />
            <div className={styles.container}>
                <div className={styles.titulo}>

                    <h2 style={{ textAlign: 'center' }}>
                        Editar accesibilidad
                    </h2>
                </div>

                <div style={{ margin: '20px auto', width: '40%', display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
                    <div className={styles.formularioCentro}>
                        <label className={styles.labelSeccion}>Tipo accesibilidad</label>
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
                        <label className={styles.labelSeccion}>Link de la imagen</label>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div >
                                {formData.imagen && <img src={formData.imagen} alt="Imagen" style={{ width: '50px', height: '50px' }} />}
                            </div>
                            <input
                                name="imagen"
                                onChange={handleChange}
                                className={styles.inputText}
                                style={{ width: '100%' }}
                                value={formData.imagen}
                            />

                        </div>
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
