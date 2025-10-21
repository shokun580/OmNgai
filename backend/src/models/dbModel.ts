import db from './conection'
import { ResultSetHeader, RowDataPacket } from "mysql2"; 
//RowDataPacket[] ช้กับ SELECT ResultSetHeader ใช้กับ INSERT/UPDATE/DELETE 
//(สามารถใช้ any ได้ แต่ของเราให้แล้วค่าเงินไม่อัปเดต เลยใช้แบบนี้) ซึ่ง ResultSetHeader + RowDataPacket ช่วยให้ TypeScript autocomplete / type checking ดีขึ้น




function addNewUser( username: string, password: string) {
    return db.query("insert into users (us_username, us_password ) values ( ?, ?)",
        [ username, password]);
}
// ดึงบัญชีของผู้ใช้
export async function getAccountsByUser(userId: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM accounts WHERE ac_us_id = ?",
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
export async function updateBalance(acId: number, amount: number): Promise<ResultSetHeader> {
  const [result] = await db.query<ResultSetHeader>(
    "UPDATE accounts SET ac_balance = ac_balance + ? WHERE ac_id = ?",
    [amount, acId]
  );
  return result;
}

export default {  addNewUser ,getAccountsByUser ,addNewTransaction, updateBalance};