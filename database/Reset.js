const mysql = require('mysql2/promise')
const crypto = require('node:crypto')

async function dropExistingDatabase(connection, name) {
    let query = `DROP DATABASE IF EXISTS ${name};`
    await connection.query(query)
}

async function useDatabase(connection, name) {
    let query = `USE ${name};`
    await connection.query(query)
}

async function createDatabase(connection, name) {
    let query = `CREATE DATABASE ${name};`
    await connection.query(query)
}

async function createCompletedRequestTable(connection) {
    let query = `CREATE TABLE completed_requests (
        id VARCHAR(255) NOT NULL, response TEXT, PRIMARY KEY (id)
    );`
    await connection.query(query)
}

async function createResumeTable(connection) {
    let query = `CREATE TABLE resume (
        id VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        user_id VARCHAR(255),
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_edit TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );`
    await connection.query(query)
}

async function createUserTable(connection) {
    let query = `
        CREATE TABLE user (
        id VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        salt VARCHAR(255) NOT NULL,
        hash_details JSON NOT NULL,
        PRIMARY KEY (id),
        UNIQUE (email))`
    await connection.query(query)
}

// unhashed password for this user: password
async function insertTestUser(connection) {
    let query = `
        INSERT INTO user (id, email, password, salt, hash_details)
        VALUES ('0f974416-16f2-4923-907d-fe266ed95348',
                'abc@def.com',
                'OG8qFLekSM554reaNIup++apAWUp8zdZjgyBmUEy/rkHrqIjE5VrpH/sfmfSaQFJn8OeSBDaZRssaJw1reTOSVd3mjt7E8lr9J7+MX9f9AJRi8YdiPGY5VEPwmyGqlI7JyWKxD3p02Pfja9N5auLmPs2L3AKrfyiLf0a9GyaN8U=',
                'Z2hyRmJl0laE7nFC4iYl5ZuNxkDuLOtuSOZvA/pwoiZtqKHOGwc8kjORciuLo/4LKjFDHP5jBN/G0FGuiSUMmnHuXJk0PhUpd5RgyqVmI4W36vW1zBoRbOV4RTEb/Izc2GbJQoIZqf98388fYTLWWlUbFDjMjo7kuIBNoUwz6sw=',
                '{"algorithm":"scrypt","keyLen":128,"cost":1024,"encoding":"base64"}');`
    await connection.query(query)
}

async function main() {
    let connection
    try {
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
        })
        await dropExistingDatabase(connection, process.env.MYSQL_DEV_DB)
        await createDatabase(connection, process.env.MYSQL_DEV_DB)
        await useDatabase(connection, process.env.MYSQL_DEV_DB)
        await createCompletedRequestTable(connection)
        await createResumeTable(connection)
        await createUserTable(connection)
        await insertTestUser(connection)

    } catch (err) {
        console.error(err.stack)
        process.exit(1)
    }
}
main().then(() => process.exit(1))