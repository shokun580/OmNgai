// Login.tsx
import { Link } from "react-router-dom";
import "./Login.css";
import Logo from "../assets/Logo.png";

function Login() {
  return (
    <main>
      <div className="login-main ">
        <div className="box bg-white shadow">
            <div className="d-flex justify-content-center align-item-center">
            <img src={Logo} alt="OmnGai" className="logo"></img>
            </div>
          <h2 className="text-center mb-2">Welcome To OmnGai</h2>

          <div className="form-area p-4">
            <h5 className="text-center mb-3">เข้าสู่ระบบหน่อย</h5>
            <input
              type="text"
              placeholder="Username"
              className="form-control p-2 mb-3"
            />
            <input
              type="password"
             placeholder="Password"
              className="form-control p-2 mb-4 "
            />
            {/* กดเพื่อไปหน้า Home */}
            <Link to='/home'> 
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary w-50 w-md-50">
                Login
              </button>
            </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
