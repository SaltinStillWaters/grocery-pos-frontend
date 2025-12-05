import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, useCurrentUser } from "../utils";

export default function LoginForm() {
  useCurrentUser(true);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `http://localhost:3000/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      console.log({ res });
      navigate('/dashboard')
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        console.error("Network error", err);
        setError("Network Error, please try again");
      }
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "380px", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-4 fw-semibold">Welcome Back</h3>

        {error && (
          <div className="alert alert-danger py-2">
            {Array.isArray(error)
              ? error.map((msg, i) => <div key={i}>{msg}</div>)
              : error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type={show ? "text" : "password"}
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={show}
              onChange={() => setShow(!show)}
            />
            <label className="form-check-label">Show password</label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
