import mysql from 'mysql';
import dotenv from 'dotenv'
dotenv.config()
export const Connect = mysql.createConnection
({
    host: process.env.HOST_NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

Connect.connect((err: any) => 
{
    if (err)
    {
        console.log("Database Not Found...");
    }
    else 
    {
        console.log("Database Connected...");
    }
})