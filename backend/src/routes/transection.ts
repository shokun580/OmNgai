import { Router, type Request, type Response } from "express";
const router = Router();

import { upload } from "../utils/upload";
import dbModel from "../models/dbModel";

//เอามาเพิ่ม user เฉย ๆ
router.post("/user", async (req:Request, res:Response): Promise<void> =>{
    const newUser = req.body;
    const result = await dbModel.addNewUser(String(newUser.username), String(newUser.password));
    if(result.length > 0){
        res.json({ status: "ok", message: 'success to add new Users', data: newUser });
    }
});

// POST /action => เพิ่มธุรกรรมใหม่
router.post("/action", async (req: Request, res: Response) => {
  const { user_id, amount, note } = req.body;

  try {
    // ดึงบัญชีของ user
    const accounts = await dbModel.getAccountsByUser(user_id);
    const account = accounts[0]; // user มีบัญชีเดียว

    if (!account) {
      return res.status(400).json({ error: "Account not found" });
    }

    // เพิ่มธุรกรรมใหม่
    const result = await dbModel.addNewTransaction(user_id, amount, note);
    const ts_id = result.insertId;

    // อัปเดตยอดเงิน
    await dbModel.updateBalance(account.ac_id, amount);

    res.json({ message: "Transaction created", transaction_id: ts_id });
  } catch (err) {
    console.error(" Error:", err);
    res.status(500).json({ error: "Server error", details: err });
  }
});





export default router;