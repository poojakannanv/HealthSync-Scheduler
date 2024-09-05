import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Import the Axios instance

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userID = localStorage.getItem('userID');

      if (token && role && userID) {
        try {
          let response;

          // Fetch user data based on the role
          if (role === 'ADMIN') {
            response = await api.get(`/admin/${userID}`);
          } else if (role === 'PROVIDER') {
            response = await api.get(`/provider/${userID}`);
          } else if (role === 'PATIENT') {
            response = await api.get(`/patient/${userID}`);
          }

          setUser(response.data);
        } catch (error) {
          console.error(error);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userID');
        }
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });

    const { userID, role, token } = response.data;

    // Store the token, role, and userID in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userID', userID);

    // Fetch the user data based on the role
    let userResponse;
    if (role === 'ADMIN') {
      userResponse = await api.get(`/admin/${userID}`);
    } else if (role === 'PROVIDER') {
      userResponse = await api.get(`/provider/${userID}`);
    } else if (role === 'PATIENT') {
      userResponse = await api.get(`/patient/${userID}`);
    }

    setUser(userResponse.data);
  };

  const register = async (registrationData) => {
    const response = await api.post('/patient/register', registrationData);

    const { patientID, role, token } = response.data;

    // Store the token, role, and patientID (as userID) in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userID', patientID);

    // Fetch the patient data after registration
    const userResponse = await api.get(`/patient/${patientID}`);

    setUser(userResponse.data);
  };

  const logout = () => {
    // Clear the stored user data and token
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userID');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
