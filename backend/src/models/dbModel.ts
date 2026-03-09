import db from "./conection";

// เพิ่ม user ใหม่
function addNewUser(username: string, password: string) {
  return db.query(
    "INSERT INTO users (us_username, us_password) VALUES ($1, $2)",
    [username, password]
  );
}

function addNewUser1() {
  return db.query(
    "INSERT INTO users (us_username, us_password) VALUES ($1, $2)",
    ["chanon", "1234"]
  );
}

// ดึงบัญชีของผู้ใช้
export async function getAccountsByUser(userId: number) {
  const result = await db.query(
    "SELECT * FROM accounts WHERE ac_us_id = $1",
    [userId]
  );
  return result.rows;
}

// ดึงข้อมูลธุรกรรมของผู้ใช้
export async function getTransactionByUser(userId: number) {
  const result = await db.query(
    `SELECT 
      t.ts_id,
      t.ts_amount,
      t.ts_note,
      a.ac_no,
      u.us_username
    FROM transactions AS t
    JOIN accounts AS a ON t.ts_ac_id = a.ac_id
    JOIN users AS u ON a.ac_us_id = u.us_id
    WHERE u.us_id = $1
    ORDER BY t.ts_id DESC`,
    [userId]
  );

  return result.rows;
}

// เพิ่มธุรกรรมใหม่
async function addNewTransaction(
  userId: number,
  amount: number,
  note?: string
) {
  const result = await db.query(
    `INSERT INTO transactions (ts_ac_id, ts_amount, ts_note)
     SELECT ac_id, $1, $2
     FROM accounts
     WHERE ac_us_id = $3`,
    [amount, note || null, userId]
  );

  return result;
}

// อัปเดตยอด balance
export async function updateBalance(acId: number, amount: number) {
  const result = await db.query(
    "UPDATE accounts SET ac_balance = ac_balance + $1 WHERE ac_id = $2",
    [amount, acId]
  );

  return result;
}

// กำหนด type Account
export interface Account {
  ac_id: number;
  ac_no: string;
  ac_balance: number;
  ac_us_id: number;
}

// ข้อมูล Account ทั้งหมด
export async function userDetail(): Promise<Account[]> {
  const result = await db.query("SELECT * FROM accounts");
  return result.rows as Account[];
}

export async function useridDetail(userId: number): Promise<Account[]> {
  const result = await db.query(
    "SELECT * FROM accounts WHERE ac_us_id = $1",
    [userId]
  );
  return result.rows as Account[];
}

export default {
  addNewUser,
  addNewUser1,
  getAccountsByUser,
  addNewTransaction,
  updateBalance,
  userDetail,
  useridDetail,
  getTransactionByUser,
};