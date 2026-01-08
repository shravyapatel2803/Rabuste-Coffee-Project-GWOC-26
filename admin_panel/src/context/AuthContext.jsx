import { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin, getMe } from '../api/auth'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        try {
          const res = await getMe();
          if (res.data.success) {
            setAdmin(res.data.data); 
          } else {
            localStorage.removeItem('adminToken');
            setAdmin(null);
          }
        } catch  {
          console.error("Session expired or invalid");
          localStorage.removeItem('adminToken');
          setAdmin(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginAdmin({ email, password });
      
      if (res.data.success) {
        localStorage.setItem('adminToken', res.data.token);
        setAdmin(res.data.admin);
        return { success: true };
      }
    } catch (error) {
      console.error("Login Failed:", error.response?.data?.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Invalid Email or Password" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};