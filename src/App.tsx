import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginForm />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
  </BrowserRouter>
  )
}
