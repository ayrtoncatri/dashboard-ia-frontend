import React, { createContext, useState, useContext } from "react";

type User = { nombre: string } | null;

interface UserContextProps {
  user: User;
  login: (nombre: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  const login = (nombre: string) => setUser({ nombre });
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
