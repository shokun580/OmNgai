import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Deposit.css";

const API_URL = import.meta.env.VITE_API_URL || "http://10.80.94.5:3000";

// utility: ลบทุกอย่างที่ไม่ใช่ตัวเลข/จุด และจำกัดทศนิยมไม่เกิน 2 ตำแหน่ง
function sanitizeMoney(input: string) {
    // ให้พิมพ์เฉพาะตัวเลขและจุดทศนิยม
    let v = input.replace(/[^\d.]/g, "");

    // กันจุดทศนิยมซ้ำ
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");

    // จำกัดทศนิยมไม่เกิน 2
    const [intPart, decPart] = v.split(".");
    if (decPart !== undefined) {
        v = intPart + "." + decPart.slice(0, 2);
    }
    return v;
}

// แปลงเป็นรูปแบบมีลูกน้ำคั่น (ใช้ en-US เพื่อได้ , เป็นตัวคั่นหลักพัน และ . เป็นทศนิยม)
function formatMoneyDisplay(raw: string) {
    if (raw === "" || raw === ".") return raw; // เคสกำลังเริ่มพิมพ์
    const n = Number(raw);
    if (!isFinite(n)) return raw;
    // ถ้ามีจุด ให้คงจำนวนหลักทศนิยมที่ผู้ใช้พิมพ์ (สูงสุด 2)
    const hasDot = raw.includes(".");
    const decimals = hasDot ? (raw.split(".")[1]?.length ?? 0) : 0;
    return n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: 2,
    });
}

export default function Deposit() {
    const navigate = useNavigate();
    // amountRaw: เก็บค่าตัวเลข “ไม่ใส่ลูกน้ำ” เพื่อส่ง API
    // amountDisplay: เก็บค่าที่แสดงใน input (มีลูกน้ำ)
    const [amountRaw, setAmountRaw] = useState("");
    const [amountDisplay, setAmountDisplay] = useState("");
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

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = sanitizeMoney(e.target.value);
        setAmountRaw(cleaned);
        setAmountDisplay(formatMoneyDisplay(cleaned));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);

        const userId = localStorage.getItem("user_id");
        if (!userId) {
            setMsg({ type: "err", text: "ไม่พบ user_id กรุณาเข้าสู่ระบบใหม่" });
            return;
        }

        const amt = Math.abs(Number(amountRaw));
        if (!amt || amt <= 0) {
            setMsg({ type: "err", text: "กรุณากรอกจำนวนเงินที่ถูกต้อง" });
            return;
        }

        try {
            setLoading(true);
            await api.post("/action", { user_id: Number(userId), amount: amt, note });
            setMsg({ type: "ok", text: "ฝากเงินสำเร็จ!" });
            setAmountRaw("");
            setAmountDisplay("");
            setNote("");
            setTimeout(() => navigate("/account"), 800);
        } catch (err: any) {
            const text = err.response?.data?.error || err.response?.data?.message || err.message;
            setMsg({ type: "err", text: text || "เกิดข้อผิดพลาด" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="deposit-container">
            <section className="deposit-card">
                <form onSubmit={handleSubmit} className="dep-form">
                    <div className="amount-block">
                        <h1 className="dep-title">Deposit</h1>
                        <div className="row-head">
                            <span className="muted">From</span>
                            <span className="muted-right">THB</span>
                        </div>

                        <div className="amount-input-wrap">
                            <span className="ccy">฿</span>
                            <input
                                className="amount-input"
                                type="text"                /* เปลี่ยนเป็น text เพื่อให้ใส่ลูกน้ำได้ */
                                inputMode="decimal"        /* มือถือจะโชว์คีย์บอร์ดตัวเลข */
                                placeholder="0.00"
                                value={amountDisplay}
                                onChange={handleAmountChange}
                                aria-label="amount"
                            />
                        </div>
                    </div>

                    <label className="lbl">Note (optional)</label>
                    <textarea
                        className="note-input"
                        placeholder="Note (optional)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                    {msg && (
                        <p className={`message ${msg.type === "ok" ? "success" : "error"}`}>
                            {msg.text}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Processing..." : "Confirm deposit"}
                    </button>
                </form>
            </section>
        </main>
    );
}