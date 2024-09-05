import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ProviderDashboard from './pages/dashboards/ProviderDashboard';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import PrivateRoute from './components/common/PrivateRoute';
import LandingPage from './pages/LandingPage';
import RegisterPatient from './pages/RegisterPatient';
import { AuthContext } from './context/AuthContext';
import "./App.css";

function App() {
  const { user } = useContext(AuthContext);

  // Function to render the appropriate dashboard based on the user's role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'PROVIDER':
        return <ProviderDashboard />;
      case 'PATIENT':
        return <PatientDashboard />;
      default:
        return null;
    }
  };

  return (
    <>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Register Page */}
        <Route path="/register" element={<RegisterPatient />} />

        {/* Dashboard Route - Requires Authentication */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute component={renderDashboard} />
          }
        />

        {/* Redirect to landing page if route not found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
