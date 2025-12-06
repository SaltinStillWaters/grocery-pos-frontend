import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Inventory from "./components/Inventory";

export default function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginForm />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/users" element={<Users />} />
    <Route path="/inventory/products" element={<Inventory />} />
    <Route path="*" element={<LoginForm />} />
  </Routes>
  </BrowserRouter>
  )
}