import { createContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../api/pocketbase";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(auth.record);

  useEffect(() => {
    setUser(auth.record);
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await auth.login(email, password);
    setUser(authData.record);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
