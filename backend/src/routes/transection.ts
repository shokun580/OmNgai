import { Router, type Request, type Response } from "express";
const router = Router();

import { upload } from "../utils/upload";
import dbModel, { userDetail, useridDetail } from "../models/dbModel.ts";

// เอามาเพิ่ม user เฉย ๆ
router.post("/user", async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = req.body;

    const result = await dbModel.addNewUser(
      String(newUser.username),
      String(newUser.password)
    );

    if ((result.rowCount ?? 0) > 0) {
      res.json({
        status: "ok",
        message: "success to add new Users",
        data: newUser,
      });
      return;
    }

    res.status(400).json({
      status: "error",
      message: "failed to add user",
    });
  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({
      status: "error",
      message: "server error",
    });
  }
});

router.post("/user1", async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = req.body;
    const result = await dbModel.addNewUser1();

    if ((result.rowCount ?? 0) > 0) {
      res.json({
        status: "ok",
        message: "success to add new Users",
        data: newUser,
      });
      return;
    }

    res.status(400).json({
      status: "error",
      message: "failed to add user",
    });
  } catch (error) {
    console.error("Add user1 error:", error);
    res.status(500).json({
      status: "error",
      message: "server error",
    });
  }
});

// POST /action => เพิ่มธุรกรรมใหม่
router.post("/action", async (req: Request, res: Response) => {
  const { user_id, amount, note } = req.body;

  try {
    // ดึงบัญชีของ user
    const accounts = await dbModel.getAccountsByUser(Number(user_id));
    const account = accounts[0]; // user มีบัญชีเดียว

    if (!account) {
      return res.status(400).json({ error: "Account not found" });
    }

    // เพิ่มธุรกรรมใหม่
    const result = await dbModel.addNewTransaction(Number(user_id), Number(amount), note);

    // pg ไม่มี insertId -> ใช้ RETURNING ts_id แล้วอ่านจาก rows[0]
    const ts_id = result.rows?.[0]?.ts_id ?? null;

    // อัปเดตยอดเงิน
    await dbModel.updateBalance(account.ac_id, Number(amount));

    return res.json({
      message: "Transaction created",
      transaction_id: ts_id,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Server error", details: err });
  }
});

router.get("/accounts", async (_req: Request, res: Response) => {
  try {
    const accounts = await userDetail();
    return res.json(accounts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "ไม่สามารถดึงข้อมูลได้" });
  }
});

interface UserParams {
  userId: string;
}

router.get("/accounts/:userId", async (req: Request<UserParams>, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "userId ต้องเป็นตัวเลข" });
    }

    const accounts = await useridDetail(userId);
    return res.json(accounts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "ไม่สามารถดึงข้อมูลได้" });
  }
});

router.get("/transactions/:userId", async (req: Request<UserParams>, res: Response) => {
  const user_id = Number(req.params.userId);

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
});

export default router;