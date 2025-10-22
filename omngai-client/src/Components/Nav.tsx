import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiOutlineArrowDownCircle, HiOutlineArrowUpCircle } from "react-icons/hi2";
import { useState } from "react";
import axios from "axios";
import "./Nav.css";
import Logo from "../assets/Logo.png";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      navigate("/");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* ===== Top Navbar ===== */}
      <header className="navbar-container">
        <nav className="navbar">
          <div className="nav-left">
            <img src={Logo} alt="OmnGai" className="nav-logo" />
            <h2 className="nav-title">OmNgai</h2>
          </div>

          <ul className="nav-links">
            <li><Link to="/home" className="nav-link">Home</Link></li>
            <li><Link to="/account" className="nav-link">Account</Link></li>
            <li><Link to="/deposit" className="nav-link">Deposit</Link></li>
            <li><Link to="/withdraw" className="nav-link">Withdraw</Link></li>
          </ul>

          <div className="nav-right">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>

          {/* Hamburger for mobile */}
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {!menuOpen ? (
              <svg width="28" height="28" viewBox="0 0 24 24">
                <path fill="currentColor" d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* ===== Side Drawer ===== */}
      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <div className="side-top">
          <div className="side-header">
            <img src={Logo} alt="OmnGai" className="side-logo" />
            <h2>OmnGai</h2>
          </div>

          <div className="side-links">
            <Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/account" onClick={() => setMenuOpen(false)}>Account</Link>
            <Link to="/deposit" onClick={() => setMenuOpen(false)}>Deposit</Link>
            <Link to="/withdraw" onClick={() => setMenuOpen(false)}>Withdraw</Link>
          </div>
        </div>

        <div className="side-bottom">
          <button className="side-logout" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {menuOpen && <div className="side-overlay" onClick={() => setMenuOpen(false)} />}

      {/* ===== Bottom Navigation (Mobile Only) ===== */}
      <nav className="bottom-nav">
        <Link to="/account" className={`bottom-item ${isActive("/account") ? "active" : ""}`}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M3 7l9 4 9-4-9-4-9 4zm0 10l9 4 9-4" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <span>Account</span>
        </Link>

        <Link to="/deposit" className={`bottom-item ${isActive("/deposit") ? "active" : ""}`}>
          <HiOutlineArrowDownCircle size={26} />
          <span>Deposit</span>
        </Link>

        <Link to="/withdraw" className={`bottom-item ${isActive("/withdraw") ? "active" : ""}`}>
          <HiOutlineArrowUpCircle size={26} />
          <span>Withdraw</span>
        </Link>
      </nav>
    </>
  );
}