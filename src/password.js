const crypto = require('node:crypto')

/**
 * @typedef PasswordHashDetails
 * @property {string} algorithm
 * @property {string} encoding The encoding used for both the password 
 * digest and the salt.
 * @property {number} keyLength The length of the key in bytes. Used for both 
 * the password digest and the salt.
 * @property {number} cost The number of hash iterations used in the hashing 
 * algorithm.
 */

/**
 * Returns details about the current password hashing technique.
 * @returns {PasswordHashDetails} details
 */
function passwordHashDetails() {
    return {
        algorithm: 'scrypt',
        encoding: 'base64',
        keyLength: 128,
        cost: 1024,
    }
}

/**
 * Hash and salt a password for storage in a database using scrypt.
 * @param string password
 * @returns {[hash: string, salt: string]} result
 */
async function hashPassword(password) {
    let details = hashDetails()
    let salt = crypto.randomBytes(details.keyLength)
        .toString(details.encoding)
    let hash = crypto.scryptSync(password, salt,
        details.keyLength, {cost: details.cost}).toString(details.encoding)
    return [hash, salt]
}

/**
 * @typedef PasswordRequirement
 * @property {string} name A camel-case string that identifies a password requirement.
 * @property {string} description Human readable description of the requirement.
 * @property {RegExp} regex Regex used to test the requirement.
 */

/** @type {PasswordRequirement[]} */
const passwordRequirements = [{
        name: 'TooShort',
        description: 'Must be at least 8 characters',
        regex: /.{8,}/
    }, {
        name: 'MustContainDigit',
        description: 'Must contain at least one digit character',
        regex: /.*[0-9].*/
    }, {
        name: 'MustContainCapitalLetter',
        description: 'Must contain at least one capital letter',
        regex: /.*[A-Z].*/
    }, {
        name: 'MustContainSpecialCharacter',
        description: 'Must contain at least one special character',
        regex: /.*[~`!@#$%^&*()_\-+={[}\]|\<,>.?\/:;"'"} ].*/
    }
]

/**
 * @typedef UnmetPasswordRequirement
 * @property {string} name
 * @property {string} description
 */

/**
 * Obtain a list of unmet password requirements for a given password.
 * @param {string} password
 * @returns {UnmetPasswordRequirement[]} unmetRequirements
 */
function checkPasswordRequirements(password) {
    let problems = []
    for (let requirement of passwordRequirements) {
        if (!requirement.regex.test(password)) {
            problems.push({
                name: requirement.name,
                description: requirement.description
            })
        }
    }
    return problems
}

module.exports = {
    passwordHashDetails,
    hashPassword,
    checkPasswordRequirements
}