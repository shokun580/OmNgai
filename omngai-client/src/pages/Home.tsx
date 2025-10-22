import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const uid = localStorage.getItem("user_id");

    if (!token) {
      navigate("/"); // ไม่มี token → กลับหน้า login
      return;
    }
    setUserId(uid);
    setLoading(false);
  }, [navigate]);

  return (
    <main className="home-page">
      {/* hero ribbon */}
      <div className="home-hero">
        <div className="hero-badge">OmnGai</div>
        <h1 className="hero-title">🏠 Home</h1>
        <p className="hero-sub">ยินดีต้อนรับเข้าสู่ระบบออมง่าย 💙</p>
      </div>

      {/* main card */}
      <section className="home-card">
        <div className="home-card-head">
          <div className="head-left">
            <h2 className="card-title">สวัสดีคุณผู้ใช้</h2>
            <span className="muted">จัดการบัญชีและทำธุรกรรมได้จากที่นี่</span>
          </div>

          <div className="id-badge">
            {loading ? "กำลังโหลด..." : userId ? `User ID: ${userId}` : "ไม่พบบัญชี"}
          </div>
        </div>

        <div className="home-row">
          <Link to="/account" className="quick quick-primary">
            <div className="quick-icon">💳</div>
            <div className="quick-text">
              <strong>บัญชีของฉัน</strong>
              <span className="muted">ดูยอดคงเหลือและประวัติ</span>
            </div>
          </Link>

          <Link to="/deposit" className="quick quick-success">
            <div className="quick-icon">💰</div>
            <div className="quick-text">
              <strong>ฝากเงิน</strong>
              <span className="muted">เพิ่มยอดเข้าบัญชี</span>
            </div>
          </Link>

          <Link to="/withdraw" className="quick quick-danger">
            <div className="quick-icon">💸</div>
            <div className="quick-text">
              <strong>ถอนเงิน</strong>
              <span className="muted">โอนออกจากบัญชี</span>
            </div>
          </Link>
        </div>

      </section>
    </main>
  );
}