import { useEffect, useState } from "react";

function AccountPage() {
  console.log("✅ AccountPage render");

  interface Account {
    ac_id: number;
    ac_no: string;
    ac_balance: number;
    ac_us_id: number;
  }
  const [accounts, setAccounts] = useState<Account[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  useEffect(() => {
    console.log("🔹 useEffect running");
    fetch(`${API_URL}/Account`)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Data from backend:", data);
        setAccounts(data);
      })
      .catch((err) => console.error("❌ Error fetching data:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-3">Account List</h2>

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
    </div>
  );
}

export default AccountPage;
