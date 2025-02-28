import { createContext, useContext, useEffect, useState } from "react";

// Define context type
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Create Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook for easy access
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ThemeProvider component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Load theme from local storage or default to dark mode
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return localStorage.getItem("theme") === "light" ? "light" : "dark";
  });

  // Apply theme changes
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
