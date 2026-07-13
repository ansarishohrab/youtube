import React, { useEffect } from "react";
import {
  createContext,
  useContext,
  useState,
} from "react";
import { getMe } from "../services/auth.service";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const user = await getMe();

      setUser(user);
    } catch (error) {
      console.error(error);

      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        setUser,
        logout,
        loading,
      },
    },
    children
  );
};

export const useAuth = () =>
  useContext(AuthContext);