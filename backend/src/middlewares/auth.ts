import { checkToken } from "../utils/token.js";

export const verifyToken = (req:any, res:any, next:any) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Expect: "Bearer <token>"

    if (checkToken(token)) {
        next()
    } else {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};