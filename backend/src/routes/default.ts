import { Router, type Request, type Response } from "express";
import { upload } from "../utils/upload.ts";
import { generateToken, checkToken } from "../utils/token.ts";
import { verifyToken } from "../middlewares/auth.ts";
import db from "../models/conection.ts";

const router = Router();

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const result = await db.query(
            "SELECT * FROM users WHERE us_username = $1 AND us_password = $2",
            [username, password]
        );

        const rows = result.rows;

        if (rows.length === 0) {
            return res.status(401).json({
                message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
            });
        }

        const user = rows[0];

        const token = generateToken({
            id: user.us_id,
            username: user.us_username,
        });

        return res.json({
            status: "ok",
            token,
            user: {
                id: user.us_id,
                username: user.us_username,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในระบบ",
        });
    }
});

/*
|--------------------------------------------------------------------------
| TOKEN TEST
|--------------------------------------------------------------------------
*/
router.get("/test-token", verifyToken, (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided",
        });
    }

    const token = authHeader.split(" ")[1] || "";

    if (checkToken(token)) {
        res.json({
            status: "ok",
            message: "Token is valid",
        });
    } else {
        res.json({
            status: "error",
            message: "Token is invalid",
        });
    }
});

export default router;