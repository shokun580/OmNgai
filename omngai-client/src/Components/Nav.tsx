import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Nav.css";
import Logo from "../assets/Logo.png";

function Nav() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogout = async () => {
    try {
      // 🔹 เรียก API logout
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });

      // 🔹 ล้าง token ใน localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");

      // 🔹 กลับไปหน้า Login
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      // fallback — แม้ logout error ก็ยังเคลียร์ localStorage ให้ผู้ใช้
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      navigate("/");
    }
  };

  return (
    <header className="navbar-container">
      <nav className="navbar">
        <div className="nav-left">
          <img src={Logo} alt="OmnGai" className="nav-logo" />
          <h2 className="nav-title">OmnGai</h2>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/home" className="nav-link">
              home
            </Link>
          </li>
          <li>
            <Link to="/deposit" className="nav-link">
              Deposit
            </Link>
          </li>
          <li>
            <Link to="/withdraw" className="nav-link">
              Withdraw
            </Link>
          </li>
        </ul>

        <div className="nav-right">
          <button className="logout-btn" onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="currentColor"
              className="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5-.5v-3H3a.5.5 0 0 1 0-1h6.5v-3a.5.5 0 0 1 1 0v3H14a.5.5 0 0 1 0 1h-3.5v3a.5.5 0 0 1-.5.5z"
              />
              <path
                fillRule="evenodd"
                d="M4 15a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h5a.5.5 0 0 1 0 1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5a.5.5 0 0 1 0 1H4z"
              />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Nav;