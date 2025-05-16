import styles from './css/Agregar.module.css'
import { useState } from 'react';
import { supabase } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
export default function AgregarTipoRecinto() {
    const navigate = useNavigate();
    const [tipo, setTipo] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {

        if (tipo == '') {
            alert('No hay datos ingresados')
            return;
        }

        e.preventDefault();
        // Buscar si ya existe
        const { data: existing, error: fetchError } = await supabase
            .from('tipo_recinto')
            .select('*')
            .eq('tipo', tipo)
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
            .from('tipo_recinto')
            .insert([
                {
                    tipo: tipo,
                },
            ])
            .select(); // se quiererecibir el registro insertado

        if (error) {
            console.error('Error al insertar en ssupabase:', error);
        } else {
            alert('Insertado correctamente: ' + data[0].tipo);
            navigate(-1);
        }
    };


    return (

        <>
            <NavbarAdmin />
            <div className={styles.container}>
                <div className={styles.titulo} >

                    <h2 style={{ textAlign: 'center' }}>
                        Agregar Tipo de recinto
                    </h2>
                </div>

                <div style={{ margin: '20px auto', width: '40%', display: 'flex', justifyContent: 'center', flexDirection: 'column', minWidth: '250px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}>

                        <label className={styles.labelSeccion} >Tipo de recinto</label>
                        <input name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}
                            className={styles.inputText} style={{ marginTop: '10px' }} />
                        <p style={{ fontSize: '0.8rem', color: 'gray' }}>*Debe ser en singular.</p>
                    </div>

                    <div className={styles.acciones}>
                        <button style={{ color: 'red', background: 'transparent', }} onClick={() => navigate(-1)}>Cancelar</button>
                        <button onClick={handleSubmit} >Agregar</button>
                    </div>
                </div>
            </div>
        </>



    )

}