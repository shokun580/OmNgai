import db from './conection'

function getallUser() {
    return db.query("SELECT * from users");
}
function getUserById(id: number) {
    return db.query("SELECT * from users WHERE us_id = ?", [id]);
}
function addNewUser(tit_id: number, fname: string, lname: string, username: string, password: string) {
    return db.query("insert into users (us_tit_id, us_fname, us_lname, us_username, us_password ) values (?, ?, ?, ?, ?)",
        [tit_id, fname, lname, username, password]);
}
function updateUser(us_tit_id: number, fname: string, lname: string, username: string, password: string, id: number) {
    return db.query("UPDATE users SET us_tit_id = ?, us_fname = ?, us_lname = ?, us_username = ?, us_password = ? WHERE us_id = ?",
        [us_tit_id, fname, lname, username, password, id]);
}
function deleteUser(id:number){
    return db.query("DELETE from users WHERE us_id = ?;", [id]);
}
function addAvatar(us_avatar: string, id: Number) {
    return db.query("UPDATE users SET us_avatar = ? WHERE us_id = ?", [us_avatar, id]);
}

export default { getallUser, getUserById, addNewUser, updateUser ,deleteUser ,addAvatar};