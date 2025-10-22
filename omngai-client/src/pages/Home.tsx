import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <main style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "2rem", color: "#0c4a6e" }}>🏠 Home Page</h1>
                <p style={{ color: "#475569" }}>
                    ยินดีต้อนรับเข้าสู่ระบบ OmnGai 💙
                </p>

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