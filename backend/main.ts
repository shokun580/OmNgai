import express from "express";
import cors, { CorsOptions } from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://10.80.94.5:5173", // ✅ มือถือจะเปิดผ่าน IP นี้
];

// ✅ allow localhost any port (flutter web ชอบสุ่มพอร์ต เช่น 65287)
const isLocalhostAnyPort = (origin: string) =>
  /^http:\/\/localhost:\d+$/.test(origin);

// ✅ allow IP any port (เผื่อเปิดจากเครื่อง/มือถือ เปลี่ยนให้ตรง IP ที่ใช้จริง)
const isLocalNetworkAnyPort = (origin: string) =>
  /^http:\/\/10\.80\.94\.5:\d+$/.test(origin);

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    // ✅ บาง request ไม่มี origin (เช่น curl/postman) ให้ผ่านได้
    if (!origin) return cb(null, true);

    if (
      ALLOWED_ORIGINS.includes(origin) ||
      isLocalhostAnyPort(origin) ||
      isLocalNetworkAnyPort(origin)
    ) {
      return cb(null, true);
    }

    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ รองรับ preflight (ชัวร์สุด ไม่พังกับ path-to-regexp)
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import defaultRouter from "./src/routes/default";
import transectionRouter from "./src/routes/transection";
app.use(defaultRouter);
app.use(transectionRouter);

app.listen(PORT, HOST, () => {
  console.log(`✅ API running at http://${HOST}:${PORT}`);
});