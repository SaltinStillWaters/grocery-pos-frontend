import { useNavigate } from "react-router-dom";
import './clickableRow.css';

interface ClickableRowProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function ClickableRow({ to, children, className }: ClickableRowProps) {
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => navigate(to)}
      className={`clickable-row ${className || ""}`}
      style={{ cursor: "pointer" }}
    >
      {children}
    </tr>
  );
}
