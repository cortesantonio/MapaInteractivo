import styles from './css/AgregarMarcador.module.css'
import { useState, useEffect } from 'react';
import { Marcador } from '../../interfaces/Marcador';
import { Accesibilidad } from '../../interfaces/Accesibilidad';
import { Tipo_Recinto } from '../../interfaces/Tipo_Recinto';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import NavbarAdmin from '../../components/NavbarAdmin';


interface TipoDeAccesibilidades {
    [tipo: string]: Accesibilidad[];
}

export default function AgregarMarcador() {

    const { user } = useAuth();
    const [accesibilidades, setAccesibilidades] = useState<TipoDeAccesibilidades>({});
    const [dataMarcador, setDataMarcador] = useState<Partial<Marcador>>({
        nombre_recinto: '',
        tipo_recinto: '',
        direccion: '',
        pagina_web: '',
        telefono: '',
        url_img: '',
        latitud: undefined,
        longitud: undefined,
        activo: true,
    });
    const [selecciones, setSelecciones] = useState<number[]>([]);
    const [tipoRecinto, setTipoRecinto] = useState<Tipo_Recinto[]>(); // almacena los recintos del llamado a la api
    const [newMarcador, setnewMarcador] = useState<Marcadorconaccesibilidad>(); // almacena el nuevo marcador que se va a agregar a la base de datos


    useEffect(() => {
        const fetchTipoRecinto = async () => {
            const { data, error } = await supabase.from('tipo_recinto').select('*');
            if (error) console.error('Error al obtener tipo recinto:', error);
            else {
                setTipoRecinto(data);
            }
        };

        fetchTipoRecinto();
    }, []);


    useEffect(() => { // LLAMADO A LA API PARA OBTNER TODOAS LAS ACCESIBILIDADES QUE HAY EN LA BASE DE DATOS Y LA CLASIFICA POR TIPO
        const fetchAccesibilidades = async () => {
            const { data, error } = await supabase.from('accesibilidad').select('*');
            if (error) console.error('Error al obtener accesibilidades:', error);
            else {
                const agrupadas: TipoDeAccesibilidades = {};
                data.forEach((acc: Accesibilidad) => {
                    if (!agrupadas[acc.tipo]) agrupadas[acc.tipo] = [];
                    agrupadas[acc.tipo].push(acc);
                });
                setAccesibilidades(agrupadas);
            }
        };
        fetchAccesibilidades();
    }, []);

    const handleCheckboxChange = (id: number) => { //MANEJA LOS IDS DE LAS ACCESIBILIDADES SELECIONADAS
        setSelecciones(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    type Marcadorconaccesibilidad = Marcador & {
        accesibilidades: number[]
    }

    const handleAgregarMarcador = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const envio: Marcadorconaccesibilidad = {
            ...(dataMarcador as Marcador),
            accesibilidades: selecciones,
        };

        setnewMarcador(envio);
    };

    useEffect(() => {
        const guardarMarcador = async () => {
            if (!newMarcador) return;

            try {
                const { data: marcadorInsertado, error: errorMarcador } = await supabase
                    .from('marcador')
                    .insert({
                        nombre_recinto: newMarcador.nombre_recinto,
                        tipo_recinto: newMarcador.tipo_recinto,
                        direccion: newMarcador.direccion,
                        pagina_web: newMarcador.pagina_web,
                        telefono: newMarcador.telefono,
                        latitud: newMarcador.latitud,
                        longitud: newMarcador.longitud,
                        activo: newMarcador.activo,
                        url_img: newMarcador.url_img,
                        id_usuario: user?.id
                    })
                    .select()
                    .single();

                if (errorMarcador) {
                    console.error('Error al guardar marcador:', errorMarcador);
                    return;
                }

                console.log('Marcador guardado:', marcadorInsertado);

                const relaciones = newMarcador.accesibilidades.map((idAcc) => ({
                    id_marcador: marcadorInsertado.id,
                    id_accesibilidad: idAcc,
                }));

                const { error: errorRelaciones } = await supabase
                    .from('accesibilidad_marcador')
                    .insert(relaciones);

                if (errorRelaciones) {
                    console.error('Error al guardar relaciones de accesibilidad:', errorRelaciones);
                    return;
                }

                console.log('Relaciones de accesibilidad guardadas con éxito.');
            } catch (error) {
                console.error('Error general al guardar el marcador:', error);
            }
        };

        guardarMarcador();
    }, [newMarcador]);



    return (
        <>
            <NavbarAdmin />

            <div className={styles.container}>
                <div className={styles.titulo} style={{ marginTop: '25px' }} >
                    <h2 style={{ textAlign: 'center' }}>
                        Agregar Marcador
                    </h2>
                </div>

                <div style={{ margin: 'auto', padding: '30px' }}>
                    <form onSubmit={handleAgregarMarcador}>
                        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>

                            <label className={styles.labelSeccion} >Nombre Locacion</label>
                            <input
                                type="text"
                                value={dataMarcador.nombre_recinto}
                                onChange={(e) => setDataMarcador({ ...dataMarcador, nombre_recinto: e.target.value })}
                                className={styles.inputText} required />
                            <label className={styles.labelSeccion} htmlFor="">Direccion</label>
                            <input
                                type="text"
                                value={dataMarcador.direccion}
                                onChange={(e) => setDataMarcador({ ...dataMarcador, direccion: e.target.value })}
                                className={styles.inputText} required />
                            <label className={styles.labelSeccion} htmlFor="">Pagina Web</label>
                            <input
                                type="text"
                                value={dataMarcador.pagina_web}
                                onChange={(e) => setDataMarcador({ ...dataMarcador, pagina_web: e.target.value })}
                                className={styles.inputText} required />

                            <label className={styles.labelSeccion} htmlFor="">Telefono</label>
                            <div className={styles.ContainerinputTelefono}>
                                <p className={styles.codTelfono}>+569</p>
                                <input
                                    type="number" value={dataMarcador.telefono}
                                    onChange={(e) => setDataMarcador({ ...dataMarcador, telefono: e.target.value })} required />
                            </div>

                            <label className={styles.labelSeccion} htmlFor="">Imagen de su local en URL</label>
                            <input
                                type="text"
                                value={dataMarcador.url_img}
                                onChange={(e) => setDataMarcador({ ...dataMarcador, url_img: e.target.value })}
                                className={styles.inputText} required />

                            <label className={styles.labelSeccion} htmlFor="">Latitud</label>
                            <input className={styles.inputText} //Crear 
                                type="number"
                                value={dataMarcador.latitud}
                                onChange={(e) => setDataMarcador({ ...dataMarcador, latitud: parseFloat(e.target.value) })} required />
                            <label className={styles.labelSeccion} htmlFor="">Longitud</label>
                            <input className={styles.inputText}
                                type="number"
                                value={dataMarcador.longitud}
                                onChange={(e) => setDataMarcador({ ...dataMarcador, longitud: parseFloat(e.target.value) })} required />

                            <label className={styles.labelSeccion}>Tipo de Recinto</label>
                            <select name="tipo_recinto" value={dataMarcador.tipo_recinto} onChange={(e) => setDataMarcador({ ...dataMarcador, tipo_recinto: e.target.value })} className={styles.inputText} required>
                                <option value="" >Selecciona un tipo de recinto</option>
                                {tipoRecinto?.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
                                ))}
                            </select>

                        </div>

                        {Object.entries(accesibilidades).map(([tipo, lista]) => (
                            <div key={tipo}>
                                <p>{`Accesibilidad ${tipo}`}</p>
                                {lista.map(acc => (
                                    <div className={styles.opt} key={acc.id}>
                                        <input
                                            type="checkbox"
                                            value={acc.id}
                                            checked={selecciones.includes(acc.id)}
                                            onChange={() => handleCheckboxChange(acc.id)}
                                            id={acc.nombre}
                                        />
                                        <label htmlFor={acc.nombre} >{acc.nombre}</label>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className={styles.acciones}>
                            <button type="submit" >Agregar Marcador</button>
                        </div>
                    </form>

                </div>
            </div>




        </>
    )

}







