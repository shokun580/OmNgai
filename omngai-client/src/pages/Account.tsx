import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Account.css";
import { HiArrowDownCircle, HiArrowUpCircle } from "react-icons/hi2";

const toNum = (v: any): number | undefined => {
    if (v === null || v === undefined) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};

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

const API_URL = import.meta.env.VITE_API_URL || "http://10.80.94.5:3000";

export default function Account() {
    const navigate = useNavigate();
    const [account, setAccount] = useState<Account | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortNewestFirst, setSortNewestFirst] = useState(true); //   toggle เรียงลำดับ

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
                const [accRes, tranRes] = await Promise.all([
                    api.get(`/accounts/${userId}`),
                    api.get(`/transactions/${userId}`),
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
                setError(
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    "ไม่สามารถดึงข้อมูลได้"
                );
            } finally {
                setLoading(false);
            }
        })();
    }, [api, navigate]);

    if (loading) return <div className="screen-center muted">กำลังโหลดข้อมูล…</div>;
    if (error) return <div className="screen-center alert-error">{error}</div>;

    const acctNumber =
        account?.ac_no ?? account?.account_number ?? account?.account_no ?? "—";
    const balance = toNum(account?.ac_balance ?? account?.balance);

    //   ฟังก์ชันเรียงลำดับตาม toggle
    const sortedTx = [...transactions].sort((a, b) => {
        const timeA = new Date(a.created_at || a.date || 0).getTime();
        const timeB = new Date(b.created_at || b.date || 0).getTime();
        return sortNewestFirst ? timeB - timeA : timeA - timeB;
    });

    return (
        <main className="account-page">
            {/* 💳 Balance Card */}
            <section className="balance-card">
                <div className="balance-card-content">
                    <div className="balance-header">
                        <span className="balance-logo">OmNgai</span>
                    </div>

                    <div className="balance-amount">
                        {typeof balance === "number"
                            ? `฿${balance.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}`
                            : "—"}
                    </div>

                    <div className="balance-info">
                        <div className="label">Account Number</div>
                        <div className="value mono">
                            {acctNumber !== "—" ? `•••• ${acctNumber.slice(-4)}` : "—"}
                        </div>
                    </div>
                </div>
                <div className="highlight"></div>
            </section>

            {/* 🧾 Scrollable Transaction List */}
            <section className="tx-scroll-area">
                <div className="tx-section-header">
                    <h2 className="tx-section-title">Transactions</h2>
                </div>

                {transactions.length === 0 ? (
                    <div className="muted">ยังไม่มีธุรกรรม</div>
                ) : (
                    <div className="tx-list">
                        {sortedTx.map((t, i) => {
                            const amt = toNum(t.ts_amount ?? t.amount);
                            const note = t.ts_note ?? t.note ?? "";
                            const isWithdraw = typeof amt === "number" && amt < 0;

                            return (
                                <article className="tx-card" key={i}>
                                    <div
                                        className={`tx-icon ${isWithdraw ? "icon-out" : "icon-in"}`}
                                    >
                                        {isWithdraw ? (
                                            <HiArrowDownCircle size={28} color="#ef4444" />
                                        ) : (
                                            <HiArrowUpCircle size={28} color="#22c55e" />
                                        )}
                                    </div>

                                    <div className="tx-main">
                                        <div className="tx-title">
                                            {isWithdraw ? "Withdraw" : "Deposit"}
                                        </div>
                                        <div className="tx-note">
                                            {note || <span className="muted">— ไม่มีหมายเหตุ —</span>}
                                        </div>
                                    </div>

                                    <div className={`tx-amount ${isWithdraw ? "out" : "in"} mono`}>
                                        {typeof amt === "number"
                                            ? (isWithdraw ? "" : "+") +
                                            Math.abs(amt).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
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