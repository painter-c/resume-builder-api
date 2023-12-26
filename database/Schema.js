const mysql = require('mysql2/promise')

const create = `
    CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`

const tables = [
    `CREATE TABLE IF NOT EXISTS user (
        id VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        salt VARCHAR(255) NOT NULL,
        hash_details JSON NOT NULL,
        PRIMARY KEY (id)
    );`
]

module.exports = {
    execute: async () => {
        try {
            const conn = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD
            })
            await conn.query(create)
            await conn.changeUser({database: process.env.DB_NAME})
            for (let table of tables) {
                await conn.query(table)
            }
        } catch (error) {
            console.error(error)
            process.exit(1)
        }
    }
}