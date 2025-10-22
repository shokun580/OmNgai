// omngai-client/src/pages/Account.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // *** 1. Import Link ***

// (Interface สำหรับข้อมูลบัญชี)
interface Account {
  ac_id: number;
  ac_no: string;
  ac_balance: number;
  ac_us_id: number;
}

function Account() {
  const USER_ID = 1; // (อย่าลืมเปลี่ยนเป็น User ID จริง)
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลยอดเงินคงเหลือ
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        // GET /accounts/:userId (ซึ่ง Back-end ของคุณมีอยู่แล้ว)
        const accountRes = await axios.get(`/accounts/${USER_ID}`);
        setAccountInfo(accountRes.data[0]); 
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccountData();
  }, [USER_ID]); // ดึงใหม่ถ้า USER_ID เปลี่ยน

  if (loading) return <div>กำลังโหลด...</div>;
  if (!accountInfo) return <div>ไม่พบบัญชี</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>บัญชีของฉัน</h1>
      <h3>เลขที่บัญชี: {accountInfo.ac_no}</h3>
      <h2 style={{ color: "green" }}>
        ยอดเงินคงเหลือ: {accountInfo.ac_balance.toFixed(2)} บาท
      </h2>

      <hr />

      {/* *** 2. นี่คือส่วนสำคัญ: ใช้ <Link> เพื่อสร้างปุ่มไปหน้าอื่น *** */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        
        {/* ปุ่มนี้จะลิงก์ไปที่ Route "/deposit" (ซึ่งก็คือไฟล์ Deposit.tsx) */}
        <Link to="/deposit" style={{ padding: "10px 20px", background: "green", color: "white", textDecoration: "none" }}>
          ไปหน้าฝากเงิน
        </Link>
        
        {/* ปุ่มนี้จะลิงก์ไปที่ Route "/withdraw" (ซึ่งก็คือไฟล์ Withdraw.tsx) */}
        <Link to="/withdraw" style={{ padding: "10px 20px", background: "red", color: "white", textDecoration: "none" }}>
          ไปหน้าถอนเงิน
        </Link>
      </div>
    </div>
  );
}

export default Account;