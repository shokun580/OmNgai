// omngai-client/src/pages/Deposit.tsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Deposit.css"; 

function Deposit() {
  const USER_ID = 1; // (ต้องเปลี่ยนเป็น user id จริง)

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState(""); // *** 1. เพิ่ม State สำหรับเก็บหมายเหตุ ***
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    const depositAmount = parseFloat(amount);

    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError("กรุณากรอกจำนวนเงินให้ถูกต้อง (ต้องมากกว่า 0)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post("/action", {
        user_id: USER_ID,
        amount: depositAmount,
        note: note || "ฝากเงิน (Web)", // *** 3. ส่ง note จาก state ไป (ถ้าว่าง ให้ใช้ค่า default) ***
      });

      alert("ฝากเงินสำเร็จ!");
      navigate("/account"); 
    
    } catch (err) {
      console.error("Deposit failed:", err);
      setError("ทำรายการฝากไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-container">
      <form className="deposit-form" onSubmit={handleDeposit}>
        <h1>ฝากเงิน</h1>
        <p>กรุณากรอกจำนวนเงินที่ต้องการฝาก</p>
        
        {/* ช่องกรอกจำนวนเงิน */}
        <label htmlFor="amount">จำนวนเงิน (บาท)</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="เช่น 100.00"
          min="0.01"
          step="0.01"
          required
        />

        {/* *** 2. เพิ่ม Input สำหรับหมายเหตุ *** */}
        <label htmlFor="note">หมายเหตุ (ไม่บังคับ)</label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="เช่น เงินเดือน, ค่าขนม"
          maxLength={100} 
        />
        {/* ******************************** */}

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "กำลังดำเนินการ..." : "ยืนยันการฝาก"}
        </button>
        
        <Link to="/account" className="back-link">
          ย้อนกลับ
        </Link>
      </form>
    </div>
  );
}

export default Deposit;