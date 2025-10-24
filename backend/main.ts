import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://10.80.94.5:5173", // ✅ มือถือจะเปิดผ่าน IP นี้
];

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import defaultRouter from "./src/routes/default";
import transectionRouter from "./src/routes/transection";
app.use(defaultRouter);
app.use(transectionRouter);


app.listen(PORT, HOST, () => {
  console.log(`✅ API running at http://${HOST}:${PORT}`);
});