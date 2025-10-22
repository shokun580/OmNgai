import { useEffect, useState } from "react";
import "./Home.css";
interface Account {
  ac_id: number;
  ac_no: string;
  ac_balance: number;
  ac_us_id: number;
}

function Home() {
  const userId = localStorage.getItem("user_id");
  console.log(userId);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (!userId) return console.warn("User ID not found");
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`${API_URL}/Home/${userId}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        console.log("✅ Data from backend:", data);
        setAccounts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchAccounts();
  }, [userId]);

  return (
    <main className="bg">
    <div className="p-4">
      <div className="">
 
        <div className="d-flex justify-content-center align-item-center">
            <div className="col-6 border border-black p-3">
                <h1 className="fs-1 fw-bold  text-uppercase head text-center">Welcome To OmnGai</h1>
            </div>
        </div>
      </div>

      {accounts.length === 0 ? (
        <p>No accounts found !!!</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Balance</th>
              <th className="border px-4 py-2">UserId</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.ac_id}>
                <td className="border px-4 py-2">{acc.ac_id}</td>
                <td className="border px-4 py-2">{acc.ac_no}</td>
                <td className="border px-4 py-2">{acc.ac_balance}</td>
                <td className="border px-4 py-2">{acc.ac_us_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </main>
  );
}

export default Home;
