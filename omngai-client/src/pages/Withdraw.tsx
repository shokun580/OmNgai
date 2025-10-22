// omngai-client/src/pages/Withdraw.tsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Withdraw.css";

function Withdraw() {
  const USER_ID = 1; // (ต้องเปลี่ยนเป็น user id จริง)

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState(""); // *** 1. เพิ่ม State สำหรับเก็บหมายเหตุ ***
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError("กรุณากรอกจำนวนเงินให้ถูกต้อง (ต้องมากกว่า 0)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post("/action", {
        user_id: USER_ID,
        amount: -withdrawAmount, 
        note: note || "ถอนเงิน (Web)", // *** 3. ส่ง note จาก state ไป (ถ้าว่าง ให้ใช้ค่า default) ***
      });

      alert("ถอนเงินสำเร็จ!");
      navigate("/account"); 
    
    } catch (err: any) {
      console.error("Withdraw failed:", err);
      if (err.response && err.response.data && err.response.data.error) {
         setError(err.response.data.error);
      } else {
         setError("ทำรายการถอนไม่สำเร็จ (อาจมียอดเงินไม่พอ)");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdraw-container">
      <form className="withdraw-form" onSubmit={handleWithdraw}>
        <h1>ถอนเงิน</h1>
        <p>กรุณากรอกจำนวนเงินที่ต้องการถอน</p>
        
        {/* ช่องกรอกจำนวนเงิน */}
        <label htmlFor="amount">จำนวนเงิน (บาท)</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="เช่น 50.00"
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
          placeholder="เช่น ค่าขนม, ค่าเดินทาง"
          maxLength={100} // กันคนพิมพ์ยาวเกินไป
        />
        {/* ******************************** */}


        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "กำลังดำเนินการ..." : "ยืนยันการถอน"}
        </button>
        
        <Link to="/account" className="back-link">
          ย้อนกลับ
        </Link>
      </form>
    </div>
  );
}

export default Withdraw;