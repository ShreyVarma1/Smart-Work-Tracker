import { useNavigate } from "react-router-dom";
import type { User } from "../types/task";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

function Navbar({ user, onLogout }: NavbarProps) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/login");
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-top">
          <div>
            <p className="eyebrow">WORK MANAGEMENT</p>
            <h1>Smart Work Tracker</h1>
            <p className="subtitle">
              Keep track of team tasks, priorities and progress.
            </p>
          </div>

          {user && (
            <div className="header-user">
              <span className="header-user-name">👤 {user.name}</span>
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
