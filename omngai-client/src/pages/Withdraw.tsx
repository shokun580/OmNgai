import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Withdraw.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Withdraw() {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/");
    }, [navigate]);

    const api = useMemo(() => {
        const instance = axios.create({ baseURL: API_URL });
        instance.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
        return instance;
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);

        const userId = localStorage.getItem("user_id");
        if (!userId) {
            setMsg({ type: "err", text: "ไม่พบ user_id กรุณาเข้าสู่ระบบใหม่" });
            return;
        }

        const amt = -Math.abs(Number(amount)); // แปลงเป็นค่าลบ
        if (!amt || amt >= 0) {
            setMsg({ type: "err", text: "กรุณากรอกจำนวนเงินที่มากกว่า 0" });
            return;
        }

        try {
            setLoading(true);
            await api.post("/action", { user_id: Number(userId), amount: amt, note });
            setMsg({ type: "ok", text: "ถอนเงินสำเร็จ!" });
            setAmount("");
            setNote("");
            setTimeout(() => navigate("/account"), 800);
        } catch (err: any) {
            const text =
                err.response?.data?.error || err.response?.data?.message || err.message;
            setMsg({ type: "err", text: text || "เกิดข้อผิดพลาด" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="withdraw-container">
            <div className="withdraw-box">
                <h1>💸 ถอนเงิน</h1>
                <p className="desc">กรอกจำนวนเงินที่ต้องการถอนจากบัญชี</p>

                <form onSubmit={handleSubmit}>
                    <label>จำนวนเงิน</label>
                    <input
                        type="number"
                        placeholder="เช่น 500 (ระบบจะส่ง -500)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />

                    <label>หมายเหตุ (ถ้ามี)</label>
                    <textarea
                        placeholder="เช่น ถอนเพื่อใช้จ่ายส่วนตัว"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>

                    {msg && (
                        <p className={`message ${msg.type === "ok" ? "success" : "error"}`}>
                            {msg.text}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className="btn-withdraw">
                        {loading ? "กำลังถอน..." : "ยืนยันถอนเงิน"}
                    </button>
                    <button
                        type="button"
                        className="btn-back"
                        onClick={() => navigate("/account")}
                    >
                        กลับหน้าบัญชี
                    </button>
                </form>
            </div>
        </main>
    );
}