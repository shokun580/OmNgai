import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Account.css";

/* helper: แปลง string/decimal -> number */
const toNum = (v: any): number | undefined => {
    if (v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

/* types (ยืดหยุ่นกับชื่อฟิลด์) */
type Account = {
    ac_no?: string;
    account_no?: string;
    account_number?: string;
    ac_balance?: number | string;
    balance?: number | string;
    [k: string]: any;
};

type Transaction = {
    ts_amount?: number | string;
    amount?: number | string;
    ts_note?: string | null;
    note?: string | null;
    created_at?: string;
    date?: string;
    [k: string]: any;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Account() {
    const navigate = useNavigate();

    const [account, setAccount] = useState<Account | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* axios + auth header */
    const api = useMemo(() => {
        const i = axios.create({ baseURL: API_URL, withCredentials: true });
        i.interceptors.request.use((cfg) => {
            const token = localStorage.getItem("token");
            if (token) cfg.headers.Authorization = `Bearer ${token}`;
            return cfg;
        });
        return i;
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        const uid = localStorage.getItem("user_id");
        if (!uid) {
            setError("ไม่พบ user_id กรุณาเข้าสู่ระบบใหม่");
            setLoading(false);
            return;
        }
        const userId = Number(uid);
        if (!Number.isFinite(userId) || userId <= 0) {
            setError("user_id ไม่ถูกต้อง");
            setLoading(false);
            return;
        }

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const [accRes, tranRes] = await Promise.all([
                    api.get<any>(`/accounts/${userId}`),
                    api.get<any>(`/transactions/${userId}`),
                ]);

                const accounts: Account[] = Array.isArray(accRes.data)
                    ? accRes.data
                    : accRes.data?.data ?? accRes.data ?? [];

                const txs: Transaction[] = Array.isArray(tranRes.data?.data)
                    ? tranRes.data.data
                    : Array.isArray(tranRes.data)
                        ? tranRes.data
                        : [];

                setAccount(accounts[0] ?? null);
                setTransactions(txs);
            } catch (err: any) {
                const msg =
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    err.message ||
                    "ไม่สามารถดึงข้อมูลได้";
                setError(msg);
            } finally {
                setLoading(false);
            }
        })();
    }, [api, navigate]);

    if (loading) return <div className="screen-center muted">กำลังโหลดข้อมูล…</div>;
    if (error) return <div className="screen-center alert-error">{error}</div>;

    const acctNumber = account?.ac_no ?? account?.account_number ?? account?.account_no ?? "—";
    const balance = toNum(account?.ac_balance ?? account?.balance);

    return (
        <main className="mb-page">
            {/* ======= Top Account Card ======= */}
            <section className="balance-card">
                <div className="balance-row">
                    <div className="balance-amount">
                        {typeof balance === "number"
                            ? balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : "—"}
                    </div>
                    {/* จุดเมนูเล็ก ๆ ไว้สวย ๆ */}
                </div>


                <div className="balance-info">
                    <div>
                        <div className="label">Number</div>
                        <div className="value mono">
                            {acctNumber !== "—" ? `•••• ${acctNumber.slice(-4)}` : "—"}
                        </div>
                    </div>
                    
                </div>
            </section>

            {/* ======= Transactions List ======= */}
            <section className="tx-section">
                <div className="tx-header">
                    <h2>Transactions</h2>
                    {/* จะมีปุ่ม See All ทีหลังก็ใส่ได้ */}
                </div>

                {transactions.length === 0 ? (
                    <div className="muted">ยังไม่มีธุรกรรม</div>
                ) : (
                    <div className="tx-list">
                        {transactions.map((t, i) => {
                            const amt = toNum(t.ts_amount ?? t.amount);
                            const note = t.ts_note ?? t.note ?? "";
                            const isWithdraw = typeof amt === "number" && amt < 0;

                            return (
                                <article className="tx-card" key={i}>
                                    <div className={`tx-icon ${isWithdraw ? "icon-out" : "icon-in"}`}>
                                        {/* ไอคอนเล็ก ๆ ด้วย SVG */}
                                        {isWithdraw ? (
                                            <svg viewBox="0 0 24 24" width="18" height="18">
                                                <path d="M3 12h14m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" width="18" height="18">
                                                <path d="M21 12H7m0 0 4 4m-4-4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>

                                    <div className="tx-main">
                                        <div className="tx-title">{isWithdraw ? "Withdraw" : "Deposit"}</div>
                                        <div className="tx-note">{note || <span className="muted">— ไม่มีหมายเหตุ —</span>}</div>
                                    </div>

                                    <div className={`tx-amount ${isWithdraw ? "out" : "in"} mono`}>
                                        {typeof amt === "number"
                                            ? (isWithdraw ? "" : "+") +
                                            Math.abs(amt).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })
                                            : "—"}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}