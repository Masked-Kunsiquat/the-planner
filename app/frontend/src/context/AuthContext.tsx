import { createContext,useEffect,useState } from "react";
import pb, { auth } from "../api/pocketbase";

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
        await pb.collection("users").authWithPassword(email, password);
        setUser(auth.record);
    };

    const logout = () => {
        auth.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};