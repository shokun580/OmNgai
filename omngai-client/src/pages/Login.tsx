// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Logo from "../assets/Logo.png";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  // src/pages/Login.tsx (เฉพาะใน handleLogin)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { username, password },
        { withCredentials: true }
      );

      // รองรับได้หลายรูปแบบ response
      const data = res.data || {};
      const token = data.token;
      const userId = data.user?.id ?? data.user_id ?? data.id ?? null;

      if (!token) {
        throw new Error(data?.message || "Invalid response from server");
      }

      localStorage.setItem("token", token);

      if (userId != null) {
        localStorage.setItem("user_id", String(userId));
      } else {
        // ถ้า backend ยังไม่ส่ง user/id มาก็ไม่ต้องเก็บ
        localStorage.removeItem("user_id");
      }

      setMsg("เข้าสู่ระบบสำเร็จ 🎉");
      navigate("/home");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        (err.request && !err.response
          ? "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้"
          : err.message || "เข้าสู่ระบบไม่สำเร็จ 😢");
      setMsg(msg);
      console.error(err);
    }
  };
  return (
    <main>
      <div className="login-main">
        <div className="box bg-white shadow">
          <div className="d-flex justify-content-center align-item-center">
            <img src={Logo} alt="OmnGai" className="logo" />
          </div>
          <h2 className="text-center mb-2">Welcome To OmnGai</h2>

          <form className="form-area p-4" onSubmit={handleLogin}>
            <h5 className="text-center mb-3">เข้าสู่ระบบหน่อย</h5>

            <input
              type="text"
              placeholder="Username"
              className="form-control p-2 mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="form-control p-2 mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary w-50">
                Login
              </button>
            </div>

            {msg && (
              <p className="text-center mt-3 text-secondary" style={{ fontSize: "14px" }}>
                {msg}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;