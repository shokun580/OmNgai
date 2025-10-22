import { Router, type Request, type Response } from "express";
import { upload } from "../utils/upload";
import mysql from "mysql2/promise";
import { generateToken, checkToken } from "../utils/token";
import { verifyToken } from "../middlewares/auth";


// const router = express.Router();
const router = Router();
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // ถ้ามี password ให้ใส่
    database: "my_oom",
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // 🔹 ตรวจสอบ username/password ใน DB
        const [rows]: any = await pool.query(
            "SELECT * FROM users WHERE us_username = ? AND us_password = ?",
            [username, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }

        const user = rows[0];
        const token = generateToken({
            id: user.us_id,
            username: user.us_username,
        });

        // ✅ ส่งกลับ token และ user
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
        res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
});


router.get('/test-token', verifyToken, (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });
    let token = authHeader.split(" ")[1] || ""; // Expect: "Bearer <token>"
    if (checkToken(token)) {
        res.json({ status: 'ok', message: "Token is valid" });
    } else {
        res.json({ status: 'error', message: "Token is invalid" });
    }
});

export default router;