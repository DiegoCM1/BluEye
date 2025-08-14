import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Crea el contexto
const ThemeContext = createContext();

// Proveedor del tema
export const ThemeProvider = ({ children }) => {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("theme");
        if (stored) {
          setColorScheme(stored);
        }
      } finally {
        setIsLoaded(true);
      }
    })();
  }, [setColorScheme]);

  // Persist theme whenever it changes
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem("theme", colorScheme);
    }
  }, [colorScheme, isLoaded]);

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTheme = () => useContext(ThemeContext);
