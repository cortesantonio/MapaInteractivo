import { useRef, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';


interface Props {
  datosGrafico: { estado: string }[];
}


const GraficoTorta = ({ datosGrafico }: Props) => {
  const navigate = useNavigate()
  const estadosPosibles = ['pendiente', 'aprobada', 'rechazada'];

  const coloresPorEstado: { [key: string]: string } = {
    pendiente: 'rgb(223, 171, 0)',
    aprobada: 'rgb(65, 170, 17)',
    rechazada: 'rgb(170, 17, 17)',
  };

  const conteoEstados: { [key: string]: number } = {
    pendiente: 0,
    aprobada: 0,
    rechazada: 0,
  };

  datosGrafico.forEach((item) => {
    if (conteoEstados.hasOwnProperty(item.estado)) {
      conteoEstados[item.estado]++;
    }
  });

  const datos = estadosPosibles.map((estado) => ({
    nombre: estado,
    valor: conteoEstados[estado],
  }));

  const datosFiltrados = datos.filter(d => d.valor > 0);

  const formatearNombre = (nombre: string) =>
    nombre.charAt(0).toUpperCase() + nombre.slice(1);


  const containerRef = useRef<HTMLDivElement>(null);
  const [outerRadius, setOuterRadius] = useState(65);
  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const { offsetHeight, offsetWidth } = containerRef.current;
        const size = Math.min(offsetHeight, offsetWidth);
        setOuterRadius(size * 0.30);
      }
    };
    setTimeout(resize, 0);

    resize();

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={containerRef}>
      {datosFiltrados.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '16px', paddingTop: '1rem' }}>No existen datos</p>
      ) : (
        <>
          <h3 style={{ textAlign: 'center', fontSize: "1.1rem", whiteSpace: "nowrap" }}>Estado de solicitudes</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosFiltrados}
                dataKey="valor"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                fill="#8884d8"
                isAnimationActive={true}
                animationDuration={800}
                labelLine={false}
                onClick={(data) => {
                  const estado = data.nombre;
                  if (estado === 'aprobada') {
                    navigate(`/panel-administrativo/solicitudes/aprobada`);
                  }
                  if (estado === 'pendiente') {
                    navigate(`/panel-administrativo/solicitudes/pendiente`);
                  }
                  if (estado === 'rechazada') {
                    navigate(`/panel-administrativo/solicitudes/rechazada`);
                  }
                }}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                  if (value <= 0) return null;

                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) / 2;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={14}
                      fontWeight="bold"
                    >
                      {value}
                    </text>
                  );
                }}
              >
                {datosFiltrados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={coloresPorEstado[entry.nombre]} />
                ))}
              </Pie>
                <Tooltip
                  formatter={(value, name) => [value, formatearNombre(name as string)]}
                />
              <Legend
                payload={datosFiltrados.map((entry) => ({
                  value: formatearNombre(entry.nombre),
                  type: 'square',
                  id: entry.nombre,
                  color: coloresPorEstado[entry.nombre],
                }))}
              />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );

};

export default GraficoTorta;