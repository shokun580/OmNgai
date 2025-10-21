import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "this_is_a_secret_key" as string;
const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

export const generateToken = (payload: any) => {
    return jwt.sign({ payload }, JWT_SECRET, { expiresIn: 60 * 60 });
};

export const checkToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};
