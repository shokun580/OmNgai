import mysql, {PoolOptions} from "mysql2/promise";

const config:PoolOptions = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '_Porch1234',
    database: process.env.DB_NAME || 'my_oom',
    port: Number(process.env.DB_PORT || 3306)
}

const db = mysql.createPool(config);


export default db;