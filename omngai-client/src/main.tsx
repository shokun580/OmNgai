// omngai-client/src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import axios from 'axios'

// *** เพิ่มบรรทัดนี้เลยครับ ***
// (นี่คือการบอก React ว่า API ทั้งหมดอยู่ที่ Port 3000)
axios.defaults.baseURL = 'http://localhost:3000'; 
// ****************************

createRoot(document.getElementById("root")!).render(
<StrictMode>
<BrowserRouter>
<App />
</BrowserRouter>
</StrictMode>
);