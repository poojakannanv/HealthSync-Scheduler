import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

export const bookAppointment = (data) => api.post("/appointments/book", data);
export const getAppointments = () => api.get("/appointments");
