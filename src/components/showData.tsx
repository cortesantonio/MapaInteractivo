import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function ShowData() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("accesibilidad").select("*"); 
      
      if (error) {
        setError(error.message);
      } else {
        setData(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>{item.tipo}</li>
      ))}
    </ul>
  );
}
// ejemplo para llamada a la api.
