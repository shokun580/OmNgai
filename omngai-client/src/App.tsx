import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./Components/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Account from "./pages/Account";

function App() {
  const location = useLocation();
  const hideNav = location.pathname === "/"; // หน้า Login

  return (
    <div>
      {!hideNav && <Nav />}  {/* Nav จะแสดงทุกหน้า ยกเว้น Login */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Accounts" element={<Account />} />
      </Routes>
    </div>
  );
}

export default App;
