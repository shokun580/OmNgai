import db from "./conection";
import { ResultSetHeader, RowDataPacket } from "mysql2";
//RowDataPacket[] ช้กับ SELECT ResultSetHeader ใช้กับ INSERT/UPDATE/DELETE
//(สามารถใช้ any ได้ แต่ของเราให้แล้วค่าเงินไม่อัปเดต เลยใช้แบบนี้) ซึ่ง ResultSetHeader + RowDataPacket ช่วยให้ TypeScript autocomplete / type checking ดีขึ้น

function addNewUser(username: string, password: string) {
  return db.query(
    "insert into users (us_username, us_password ) values ( ?, ?)",
    [username, password]
  );
}
function addNewUser1() {
  return db.query(
    "insert into users (us_username, us_password ) values ( ?, ?)",
    ["chanon", "1234"]
  );
}

// ดึงบัญชีของผู้ใช้
export async function getAccountsByUser(userId: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM accounts WHERE ac_us_id = ?",
    [userId]
  );
  return rows;
}

// ดึงข้อมูลธุรกรรมของผู้ใช้
export async function getTransactionByUser(userId: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT 
    t.ts_id,
    t.ts_amount,
    t.ts_note,
    a.ac_no,
    u.us_username
    FROM transactions AS t
    JOIN accounts AS a ON t.ts_ac_id = a.ac_id
    JOIN users AS u ON a.ac_us_id = u.us_id
    WHERE u.us_id = ?
    ORDER BY t.ts_id DESC;`,
    [userId]
  );
  return rows;
}

// เพิ่มธุรกรรมใหม่
async function addNewTransaction(
  userId: number,
  amount: number,
  note?: string
): Promise<ResultSetHeader> {
  const [result] = await db.query<ResultSetHeader>(
    `INSERT INTO transactions (ts_ac_id, ts_amount, ts_note)
     SELECT ac_id, ?, ?
     FROM accounts
     WHERE ac_us_id = ?`,
    [amount, note || null, userId]
  );
  return result;
}
// อัปเดตยอด balance
export async function updateBalance(
  acId: number,
  amount: number
): Promise<ResultSetHeader> {
  const [result] = await db.query<ResultSetHeader>(
    "UPDATE accounts SET ac_balance = ac_balance + ? WHERE ac_id = ?",
    [amount, acId]
  );
  return result;
}


//กำหนด Account
export interface Account extends RowDataPacket {
  ac_id: number;
  ac_no: string;
  ac_balance: number;
  ac_us_id: number;
}
//ข้อมูล Account ทั้งหมด
export async function userDetail(): Promise<Account[]> {
  const [rows] = await db.query("SELECT *  FROM accounts");
  return rows as Account[];
}

export async function useridDetail(userId: number): Promise<Account[]> {
  const [rows] = await db.query("SELECT *  FROM accounts WHERE ac_us_id = ?", [userId]);
  return rows as Account[];
}

export default { addNewUser, addNewUser1, getAccountsByUser, addNewTransaction, updateBalance, userDetail, useridDetail, getTransactionByUser };
