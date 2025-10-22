import { Router, type Request, type Response } from "express";
const router = Router();

import { upload } from "../utils/upload";
import dbModel, { userDetail, useridDetail } from "../models/dbModel";

//เอามาเพิ่ม user เฉย ๆ
router.post("/user", async (req: Request, res: Response): Promise<void> => {
  const newUser = req.body;
  const result = await dbModel.addNewUser(
    String(newUser.username),
    String(newUser.password)
  );
  if (result.length > 0) {
    res.json({
      status: "ok",
      message: "success to add new Users",
      data: newUser,
    });
  }
});

router.post("/user1", async (req: Request, res: Response): Promise<void> => {
  const newUser = req.body;
  const result = await dbModel.addNewUser1();
  if (result.length > 0) {
    res.json({
      status: "ok",
      message: "success to add new Users",
      data: newUser,
    });
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

router.get("/Account", async (req: Request, res: Response) => {
  try {
    const accounts = await userDetail();
    res.json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลได้" });
  }
});
interface UserParams {
  userId: string;
}
router.get("/account/:userId", async (req: Request<UserParams>, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "userId ต้องเป็นตัวเลข" });
    }

    const home = await useridDetail(userId);
    res.json(home);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลได้" });
  }
});

router.get("/transactions/:userId", async (req: Request, res: Response) => {
    const user_id = Number(req.params.userId);

    // ตรวจสอบความถูกต้องของ userId
    if (!Number.isInteger(user_id) || user_id <= 0) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    try {
      const transactions = await dbModel.getTransactionByUser(user_id);
      return res.status(200).json({
        user_id,
        count: transactions.length,
        data: transactions,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;

