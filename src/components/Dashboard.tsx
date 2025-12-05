import axios from "axios";
import { API_URL, useCurrentUser } from "../utils";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const user = useCurrentUser();
  const navigate = useNavigate();

  const buttons = [
    { label: "Users", path: "/users" },
    { label: "Inventory", path: "/inventory" },
    { label: "Restock", path: "/restocks" },
    { label: "Adjust", path: "/adjustments" },
    { label: "Cashier", path: "/sell" },
  ];

  async function handleLogout() {
    try {
      const res = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        console.error("Network error", err);
        setError("Network Error, please try again");
      }
    }
  }

  if (!user)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status"></div>
      </div>
    );

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-5">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold">Welcome, {user.username}</h2>
          <button
            className="btn btn-outline-dark rounded-pill px-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="row g-4">
          {buttons.map(({ label, path }) => (
            <div className="col-12 col-md-6 col-lg-4" key={path}>
              <div
                className="card border-0 shadow-sm hover-highlight"
                style={{ borderRadius: "18px" }}
                onClick={() => navigate(path)}
              >
                <div className="card-body py-4 px-4">
                  {/* Badge without color */}
                  <span
                    className="badge bg-secondary bg-opacity-25 text-secondary mb-3"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {label}
                  </span>

                  {/* <h5 className="fw-semibold">{label}</h5> */}
                  <p
                    className="text-secondary mb-0"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Navigate to {label.toLowerCase()} module →
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function setError(message: any) {
  throw new Error("Function not implemented.");
}
