import styles from './css/Agregar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { supabase } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
export default function AgregarAccesibilidad() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Accesibilidad>({
        id: 0,
        tipo: '',
        nombre: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'id' ? Number(value) : value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {

        if (formData.nombre == '' || formData.tipo == '') {
            alert('No hay datos ingresados')
            return;
        }

        e.preventDefault();
        // Paso 1: Buscar si ya existe
        const { data: existing, error: fetchError } = await supabase
            .from('accesibilidad')
            .select('*')
            .eq('nombre', formData.nombre)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error al verificar existencia:', fetchError);
            return;
        }

        if (existing) {
            alert('Este nombre de accesibilidad ya está registrado.');
            return;
        }


        const { data, error } = await supabase
            .from('accesibilidad')
            .insert([
                {
                    tipo: formData.tipo,
                    nombre: formData.nombre,
                },
            ])
            .select(); // opcional: si quieres recibir el registro insertado

        if (error) {
            console.error('Error al insertar en Supabase:', error);
        } else {
            alert('Insertado correctamente: ' + data[0].nombre);
            navigate(-1);
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.titulo} >
                <button onClick={() => { navigate(-1) }} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faReply} size='2xl' />
                </button>
                <h2 style={{ textAlign: 'center' }}>
                    Agregar Accesibilidad
                </h2>
            </div>

            <div style={{ margin: '20px auto', width: '40%', display: 'flex', justifyContent: 'center', flexDirection: 'column', minWidth: '250px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}>
                    <label className={styles.labelSeccion} >Tipo Accesibilidad</label>
                    <select name="tipo" value={formData.tipo} onChange={handleChange}>
                        <option value="">Selecciona un tipo</option>
                        <option value="Arquitectónica">Arquitectónica</option>
                        <option value="Sensorial">Sensorial</option>
                        <option value="Cognitiva">Cognitiva </option>
                        <option value="CA">CA </option>
                    </select>
                    <label className={styles.labelSeccion} style={{ marginTop: '10px' }} >Nombre</label>
                    <input name="nombre" onChange={handleChange}
                        className={styles.inputText} />
                </div>

                <div className={styles.acciones}>
                    <button onClick={() => { navigate(-1) }} style={{ color: 'red', background: 'transparent', }}>Cancelar</button>
                    <button onClick={handleSubmit} >Agregar</button>
                </div>
            </div>
        </div>


    )

}