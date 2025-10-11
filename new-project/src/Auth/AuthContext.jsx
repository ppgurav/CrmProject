// import React, { createContext, useContext, useEffect, useState } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     () => localStorage.getItem('isAuthenticated') === 'true'
//   );

//   const login = () => {
//     setIsAuthenticated(true);
//     localStorage.setItem('isAuthenticated', 'true');
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem('isAuthenticated');
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);







// import React, { createContext, useContext, useEffect, useState } from 'react';

// // Hardcoded API base URL from Vite env
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     () => sessionStorage.getItem('isAuthenticated') === 'true'
//   );
//   const [user, setUser] = useState(null);

//   const login = (token) => {
//     setIsAuthenticated(true);
//     sessionStorage.setItem('isAuthenticated', 'true');
//     sessionStorage.setItem('token', token);
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     setUser(null);
//     sessionStorage.removeItem('isAuthenticated');
//     sessionStorage.removeItem('token');
//   };

//   // Fetch current user
//   // const fetchCurrentUser = async () => {
//   //   const token = sessionStorage.getItem('token');
//   //   if (!token) return;

//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}auth/me`, {
//   //       method: 'GET',
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`,
//   //         'Content-Type': 'application/json',
          
//   //       }
//   //     });

//   //     if (!response.ok) throw new Error('Failed to fetch user');

//   //     const data = await response.json();
//   //     setUser(data);
//   //   } catch (error) {
//   //     console.error(error);
//   //     logout();
//   //   }
//   // };
//   const fetchCurrentUser = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       console.warn("No token found in sessionStorage");
//       logout();
//       return;
//     }
  
//     try {
//       const response = await fetch(`${API_BASE_URL}auth/me`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });
  
//       console.log("Fetch status:", response.status);
  
//       const data = await response.json();
//       console.log("Response data:", data);
  
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch user");
//       }
  
//       setUser(data);
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       logout();
//     }
//   };
  
//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchCurrentUser();
//     }
//   }, [isAuthenticated]);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);




import React, { createContext, useContext, useEffect, useState } from 'react';

// ✅ API base URL (ensure this is defined in your .env file, e.g. VITE_API_BASE_URL="http://erpapi.technfest.com/")
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://erpapi.technfest.com/';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('isAuthenticated') === 'true'
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ LOGIN FUNCTION
  const login = (token) => {
    if (!token) return;
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('token', token);
    fetchCurrentUser(); // Fetch user immediately after login
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('token');
  };

  // ✅ FETCH CURRENT USER FROM /me ENDPOINT
  const fetchCurrentUser = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.warn('⚠️ No token found in sessionStorage.');
      logout();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Fetch /me status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }

      // ✅ Set the user data from API response
      setUser(data);
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Automatically fetch user when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
    }
  }, [isAuthenticated]);

  // ✅ Context value
  const value = {
    isAuthenticated,
    login,
    logout,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use Auth context
export const useAuth = () => useContext(AuthContext);
