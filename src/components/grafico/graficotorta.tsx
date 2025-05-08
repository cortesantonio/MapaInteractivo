import { useRef, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface Props {
  datosGrafico: { estado: string }[];
}


const GraficoTorta = ({ datosGrafico}: Props) => {
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


  const containerRef = useRef<HTMLDivElement>(null);
  const [outerRadius, setOuterRadius] = useState(80); 
  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const { offsetHeight, offsetWidth } = containerRef.current;
        const size = Math.min(offsetHeight, offsetWidth);
        setOuterRadius(size * 0.35); 
      }
    };
  
    resize(); 
  
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }} >
      {datosFiltrados.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '16px', paddingTop: '1rem' }}>No existen datos</p>
      ) : (
        <ResponsiveContainer ref={containerRef}  width="100%" height="100%">
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
          <Tooltip />
          <Legend
            payload={datosFiltrados.map((entry) => ({
              value: entry.nombre,
              type: 'square',
              id: entry.nombre,
              color: coloresPorEstado[entry.nombre],
            }))}
          />
        </PieChart>
        </ResponsiveContainer>
        
      )}
    </div>
  );
};

export default GraficoTorta;