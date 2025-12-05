import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL, useCurrentUser } from "../utils";

type NavButton = { label: string; path: string };

export default function Header({ buttons }: { buttons?: NavButton[] }) {
  const user = useCurrentUser();
  const navigate = useNavigate();

  const defaultButtons: NavButton[] = [
    { label: "Users", path: "/users" },
    { label: "Inventory", path: "/inventory" },
    { label: "Restock", path: "/restocks" },
    { label: "Adjust", path: "/adjustments" },
    { label: "Cashier", path: "/sell" },
  ];

  const navButtons = buttons ?? defaultButtons;

  async function handleLogout() {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      navigate("/login");
    } catch (err: any) {
      console.error("Logout failed", err?.response ?? err);
    }
  }

  if (!user)
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <div className="spinner-border" role="status" aria-hidden />
      </div>
    );

  return (
    <>
      <div className="header-trigger"></div>
      <div className="header-wrapper">
        <header className="slide-header d-flex justify-content-between align-items-center px-5 py-2">
          <h2
            className="mb-0 fw-bold d-none d-sm-block"
            style={{ fontSize: "2rem" }}
          >
            Hi, {user.username}
          </h2>
          <div className="nav-center d-flex gap-3">
            {navButtons.map(({ label, path }) => (
              <button
                key={path}
                className="nav-btn"
                onClick={() => navigate(path)}
              >
                {label}
              </button>
            ))}
          </div>

          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </header>
      </div>
    </>
  );
}
