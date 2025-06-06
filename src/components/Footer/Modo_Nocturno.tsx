import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  modoNocturno: boolean;
  setModoNocturno: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modoNocturno, setModoNocturno] = useState(() => {
    // Recuperar el estado del localStorage al iniciar
    const saved = localStorage.getItem('modoNocturno');
    return saved ? JSON.parse(saved) : false;
  });

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('modoNocturno', JSON.stringify(modoNocturno));
  }, [modoNocturno]);

  return (
    <ThemeContext.Provider value={{ modoNocturno, setModoNocturno }}>
      {children}
    </ThemeContext.Provider>
  );
};