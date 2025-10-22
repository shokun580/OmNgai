import express from "express";
import cors from "cors";

const app = express();
const POST = process.env.PORT || 3000;

// ✅ เปิด CORS ให้ React เข้าถึงได้
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ import router ตามของเดิม
import defaultRouter from "./src/routes/default";
import transectionRouter from "./src/routes/transection";

app.use(defaultRouter);
app.use(transectionRouter);

app.listen(POST, () => {
  console.log(`✅ Server is running on port ${POST}`);
});