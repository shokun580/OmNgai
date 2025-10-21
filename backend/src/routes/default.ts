import { Router, type Request, type Response } from "express";
import { upload } from "../utils/upload";

import { generateToken, checkToken } from "../utils/token";
import { verifyToken } from "../middlewares/auth";


// const router = express.Router();
const router = Router();

router.post("/login", (req: Request, res: Response) => {
    let { username, password } = req.body;
    let token = generateToken(username);
    res.json({ status: 'ok', username, password, token });
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