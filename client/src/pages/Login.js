import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";
import Header from "../components/landing/Header";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate("/dashboard"); 
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <Header />
      <Container maxWidth="sm" sx={{ marginTop: 8 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box textAlign="center" marginBottom={2}>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("email", { required: true })}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("password", { required: true })}
            />
            {error && (
              <Typography color="error" align="center" marginTop={2}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 3, padding: 1.5 }}
            >
              Login
            </Button>
            <Box textAlign="center" marginTop={2}>
              <Typography variant="body2">
                Don't have an account? <Link to="/register">Register here</Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
