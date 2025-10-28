// Withdraw.tsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Withdraw.css";

const API_URL = import.meta.env.VITE_API_URL || "http://10.80.94.5:3000";

// ใส่ลูกน้ำทุก 3 หลัก (เฉพาะส่วนจำนวนเต็ม)
const formatNumber = (value: string) => {
    // ตัด , ออกก่อน แล้วค่อยจัดรูปแบบใหม่
    const raw = value.replace(/,/g, "");
    if (raw === "") return "";
    const parts = raw.split(".");
    // ใส่ลูกน้ำเฉพาะหน้าจุดทศนิยม
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

// แปลง string ที่มีลูกน้ำ -> number (รองรับทศนิยม)
const toNumeric = (value: string) => Number(value.replace(/,/g, "") || "0");

export default function Withdraw() {
    const navigate = useNavigate();
    const [amount, setAmount] = useState(""); // เก็บเป็น string เพื่อให้ format ได้สวยตอนพิมพ์
    const [note, setNote] = useState("");
    const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
        null
    );
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

        // แปลงค่า amount (มี ,) -> ตัวเลข แล้วทำให้เป็นค่าถอน (ติดลบ)
        const numeric = toNumeric(amount);
        const amt = -Math.abs(numeric);

        if (!numeric || numeric <= 0) {
            setMsg({ type: "err", text: "กรุณากรอกจำนวนเงินที่มากกว่า 0" });
            return;
        }

        try {
            setLoading(true);
            await api.post("/action", {
                user_id: Number(userId),
                amount: amt, // ส่งเป็นตัวเลขจริง (ไม่มีลูกน้ำ)
                note,
            });
            setMsg({ type: "ok", text: "ถอนเงินสำเร็จ!" });
            setAmount("");
            setNote("");
            setTimeout(() => navigate("/account"), 800);
        } catch (err: any) {
            const text =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message;
            setMsg({ type: "err", text: text || "เกิดข้อผิดพลาด" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="withdraw-container">
            <section className="withdraw-card">
                <form onSubmit={handleSubmit} className="withdraw-form">
                    <div className="amount-block">
                        <h1 className="wd-title">Withdraw</h1>
                        <div className="row-head">
                            <span className="muted">To</span>
                            <span className="muted-right">THB</span>
                        </div>

                        <div className="amount-input-wrap">
                            <span className="ccy">฿</span>
                            <input
                                className="amount-input"
                                type="text" // ใช้ text เพื่อให้ฟอร์แมต , ได้
                                inputMode="decimal"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    // อนุญาตเฉพาะตัวเลขและจุดทศนิยม
                                    const raw = e.target.value.replace(/,/g, "");
                                    if (!/^\d*\.?\d*$/.test(raw)) return;
                                    setAmount(formatNumber(e.target.value));
                                }}
                                onBlur={(e) => {
                                    // จัดระเบียบตอน blur (เช่น 100. -> 100, 001 -> 1)
                                    const raw = e.target.value.replace(/,/g, "");
                                    if (raw === "") return;
                                    const n = Number(raw);
                                    // ถ้าอยากบังคับเลขทศนิยม 2 ตำแหน่ง ให้ใช้: n.toFixed(2)
                                    setAmount(formatNumber(String(n)));
                                }}
                                required
                            />
                        </div>
                    </div>

                    <label className="lbl">Note (optional)</label>
                    <textarea
                        className="note-input"
                        placeholder="Note (optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>

                    {msg && (
                        <p className={`message ${msg.type === "ok" ? "success" : "error"}`}>
                            {msg.text}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Processing..." : "Confirm withdraw"}
                    </button>
                </form>
            </section>
        </main>
    );
}