import React, { createContext, useContext, useState, useEffect } from 'react';

interface FontSizeContextType {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize debe usarse dentro de un FontSizeProvider.');
  }
  return context;
};

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    // Recuperar el tamaño de fuente del localStorage al iniciar
    const saved = localStorage.getItem('fontSize');
    return saved ? parseFloat(saved) : 1;
  });

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    if (fontSize < 1.5) {
      setFontSize(prevSize => Math.round((prevSize + 0.1) * 10) / 10);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 0.8) {
      setFontSize(prevSize => Math.round((prevSize - 0.1) * 10) / 10);
    }
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};