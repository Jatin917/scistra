// const mysql = require('mysql2');
import mysql from 'mysql2'


// Connect to MySQL
export const Connection = () =>{
    // Set up connection
    const connection = mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DB,
      port: process.env.PORT,
    });

    connection.connect((err) => {
      if (err) {
        console.error('Connection error:', err);
        return;
      }
      console.log('Connected to Aiven MySQL!');
    });
}