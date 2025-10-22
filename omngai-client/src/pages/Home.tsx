import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const uid = localStorage.getItem("user_id");

    if (!token) {
      navigate("/"); // ไม่มี token → กลับหน้า login
    } else {
      setUserId(uid);
    }
  }, [navigate]);

  return (
    <main className="home bg ">
      <div >
        <div className="info">
          <h1 style={{textAlign:"center",  fontSize: "3rem", color: "#0c4a6e" }}>🏠 Home Page</h1>
        
          <p style={{ color: "#475569", fontSize: "2rem"}}>ยินดีต้อนรับเข้าสู่ระบบ OmnGai (ออมง่าย) 💙</p>
          <p>OmnGai111 ฝากไว ถอนนาน</p>
        </div>
        {/* ✅ แสดง userId */}
        {userId ? (
          <p style={{ marginTop: "10px", fontWeight: "500" }}>
            User ID: {userId}
          </p>
        ) : (
          <p style={{ color: "gray" }}>กำลังโหลด...</p>
        )}
      </div>
    </main>
  );
}

export default Home;
