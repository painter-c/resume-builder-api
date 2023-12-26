import { PasswordHashDetails } from './password'
import { Pool as MySqlPool } from 'mysql2'

/**
 * @constructor
 * @param {string} id
 * @param {string} email
 * @param {string} passwordHash
 * @param {string} salt
 * @param {string|PasswordHashDetails} hashDetails
 */
function User(id, email, passwordHash, salt, hashDetails) {
    this.id = id
    this.email = email
    this.passwordHash = passwordHash
    this.salt = salt
    this.hashDetails = (typeof hashDetails === 'string') ?
        hashDetails : JSON.stringify(hashDetails)
}

/**
 * @param {User} user
 * @param {MySqlPool} conn
 * @returns {void}
 */
async function insertUser(user, conn) {
    let sql = `INSERT INTO user (id, email, password, salt, hash_details)
        VALUES (?, ?, ?, ?, ?);`
    conn.query(sql, [user.id,
        user.email,
        user.passwordHash,
        user.salt,
        user.hashDetails
    ])
}