import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import App from './App';
import { AuthProvider } from './context/AuthContext';  // Import the AuthProvider
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <AuthProvider>  {/* Wrap the application with AuthProvider */}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
