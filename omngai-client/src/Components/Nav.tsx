import { Link } from "react-router-dom";
import "./Nav.css";
import Logo from "../assets/Logo.png";

function Nav() {
  return (
    <main>
      <div className=" bg-gray-200 ">
        <nav>
          <ul className="nav gap-2 p-2 py-1 form-control-lg">
            <li className="nav-item ">
              <img src={Logo} alt="OmnGai" className="logo"></img>
            </li>
            <li className="nav-item centerNav gap-4 ms-5">
              <Link to="/Home" className=" text-decoration-none text-black">
                Home
              </Link>
            </li>
            <li className="nav-item centerNav ms-5">
              <Link to="/Account" className=" text-decoration-none text-black">
                Account
              </Link>
            </li>

            <li className="nav-item centerNav ms-auto px-3 ">
              <Link
                to="/"
                className="d-flex flex-row centerNav gap-2 text-decoration-none text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="black"
                  className="bi bi-box-arrow-in-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                  />
                </svg>
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  );
}

export default Nav;
