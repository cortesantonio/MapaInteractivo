import { useState, useEffect } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  address: string;
  status: "En curso" | "Próximo";
  colorStatus: "#666666" | "#969595";
}

const useGetCalendario = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const calendarId = "correoprueba56026@gmail.com";
  const apiKey = import.meta.env.VITE_GOOGLE_APIKEY;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!calendarId || !apiKey) {
        setError("Faltan las credenciales del calendario");
        return;
      }

      try {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los eventos");
        }
        const data = await response.json();

        const formatDateTime = (dateTime?: string) => {
          if (!dateTime) return "Sin Información";

          const date = new Date(dateTime);
          if (isNaN(date.getTime())) return "Sin Información";

          return date.toLocaleString("es-ES", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        };

        const getStatus = (start: string, end: string): { status: "En curso" | "Próximo", colorStatus: string } => {
          if (!start || !end) return { status: "Próximo", colorStatus: "#666666" };

          const now = new Date();
          const startDate = new Date(start);
          const endDate = new Date(end);

          if (now >= startDate && now <= endDate) {
            return { status: "En curso", colorStatus: "#24c116" };
          }

          return { status: "Próximo", colorStatus: "#969595" };
        };

        const formattedEvents: CalendarEvent[] = data.items.map((event: any) => {
          const start = event.start?.dateTime || event.start?.date || "";
          const end = event.end?.dateTime || event.end?.date || "";
          const { status, colorStatus } = getStatus(start, end);
          return {
            id: event.id,
            title: event.summary || "Sin título",
            description: event.description || "Sin descripción",
            address: event.location || "Ubicación no disponible",
            start: start, 
            end: end,     
            status: status,
            colorStatus: colorStatus,
          };
        });

        formattedEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());


        const currentEvents = formattedEvents.filter(event => {
          const endDate = new Date(event.end);
          const now = new Date();
          return endDate > now;
        });

        const finalEvents = currentEvents.map(event => ({
          ...event,
          start: formatDateTime(event.start),
          end: formatDateTime(event.end),
        }));


        setEvents(finalEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [calendarId, apiKey]);

  return { events, loading, error };
};

export default useGetCalendario;

