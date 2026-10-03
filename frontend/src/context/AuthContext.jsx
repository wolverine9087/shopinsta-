import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore the user from localStorage when the app starts.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("shopinsta-user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  });

  // Login
  const login = (details) => {
    localStorage.setItem(
      "shopinsta-user",
      JSON.stringify(details)
    );

    setUser(details);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("shopinsta-user");
    setUser(null);
  };

  // Value shared with all components using useAuth().
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for accessing authentication data.
export const useAuth = () => useContext(AuthContext);
